const express = require('express');
const axios = require('axios');
const moment = require('moment');
const parser = require('body-parser');
const path = require('path');
const db = require('../database/models.js');
const Sequelize = require('sequelize');
const session = require('express-session');
const CronJob = require('cron').CronJob;
const multerS3 = require('multer-s3');
const multer = require('multer');
const aws = require('aws-sdk');
const config = require('../config.js');

const Op = Sequelize.Op;

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port);
const io = require('socket.io').listen(server);

const sess = {
  secret: 'tyrell',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 8 * 60 * 60 * 1000
  },
  rolling: true,
};

app.use(session(sess));


app.use(parser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

//* *************************** AMAZON S3 IMAGE STORAGE ************************

aws.config.update({
  secretAccessKey: config.S3_SECRET,
  accessKeyId: config.S3_KEY,
  region: 'us-east-1',
});
const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'tyrell-pos',
    key: function(req, file, cb) {
      cb(null, `${new Date()}-${file.originalname}`);
    }
  }),
});

//* **************************** AMAZON SES EMAIL STUFF ************************
app.post('/send/receipt', (req, res) => {
  let menuItems = '';
  for (let i = 0; i < req.body.items.length; i += 1) {
    menuItems += `${req.body.items[i].item_name}\n`;
  }

  let emailParams = {
    Destination: { /* required */
      ToAddresses: [
        req.body.email,
        /* more items */
      ],
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
          Charset: 'UTF-8',
          Data: `Your purchased items\n${menuItems}\nTotal Price: $ ${req.body.price}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Your Receipt',
      },
    },
    Source: 'jieningjchen@gmail.com', /* required */

  };

  let sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(emailParams).promise();
  sendPromise.then(
    function(data) {
      res.send();
    }).catch(
      function(err) {
      console.error(err, err.stack);
    });
  res.end();
});
//* **************************** MIDDLEWARE ************************************
let auth = function(req, res, next) {
  if (req.session.employee) {
    next();
  } else {
    res.status(401).send();
  }
};

//* **************************** POST REQUESTS *********************************
app.post('/test', (req, res) => {
  db.Category.create({ category_name: 'Test2Test' })
    .then(() => {
      res.send('success');
    });
});

app.post('/delete/item', (req, res) => {
  db.Item.find({
    where: { item_name: req.body.item_name
    }
  }).then((found) => {
    found.destroy();
  })
})

app.post('/delete/category', (req, res) => {
  db.Category.find({
    where: {
      category_name: req.body.category_name
    }
  }).then((found) => {
    found.destroy();
  })
  })

app.post('/delete/employee', (req, res) => {
  db.Employee.find({
    where: {
      employee_id: req.body.employee_id
    }
  }).then((found) => {
    found.destroy();
  }).then(() => {
    db.Timesheet.findAll({
      where: {
        employee_id: req.body.employee_id
      }
    }).then((list) => {
      if (list.length > 0) {
        list.destroy();
      }
    }).then(() => {
      db.Sale.findAll({
        where: {
          employee_id: req.body.employee_id
        }
      }).then((sales) => {
        if (sales.length > 0) {
          sales.destroy();
        }
      }).then(() => {
        res.send();
      })
    })
  })
})

app.post('/create/item', upload.any(), (req, res) => {
  db.Item.create({
    item_name: req.body.item_name,
    item_price: req.body.item_price,
    item_ingredients: JSON.stringify(req.body.item_ingredients),
    item_category: req.body.item_category
  }).then(() => {
    res.send();
  })
  res.end();
})

app.post('/create/category', (req, res) => {
  db.Category.create({ category_name: req.body.category_name })
    .then(() => {
      res.send()
    }).catch((error) => {
      res.send(error);
    });
})

app.post('/completed/transaction', (req, res) => {
  const itemList = [];
  for (let i = 0; i < req.body.transactionItems.length; i += 1) {
    itemList.push(req.body.transactionItems[i].id);
  }
  /* below is capturing payment type (cash or credit) from making new sales vs void */
  let type = false;
  if (req.body.type || (req.body.cash === true)) {
    type = true;
  }

  let employee = JSON.parse(req.session.employee);
  let time = moment().format();
  let ingredientsList = [];
  let saleType = 0;
  if (req.body.orderNumber) {
    saleType = req.body.orderNumber;
  }
  let multiplier = 1;
  if (saleType !== 0) {
    multiplier = -1;
  }

  if (saleType === 0) {
    for (let i = 0; i < itemList.length; i += 1) {
      db.Item.update(
        {
          item_popularity: Sequelize.literal('item_popularity + 1'),
        },
        {
          where: {
            id: itemList[i],
          },
        }
      ).catch((error) => {
        res.send(error);
      });
    }
  }

  return Promise.all(req.body.transactionItems.map((item) => {
    const parseItem = JSON.parse(item.item_ingredients);
    return Promise.all(parseItem.map((ingredient) => {
      return db.Ingredient.findAll({
        where: {
          id: ingredient.ingredient_id,
        },
      })
        .then((result) => {
          console.log('this is results!!!!!!!!!!!!!!!!! alalalalalala', result)
          return result[0].unit_cost * ingredient.ingredient_amount;
        });
    }))
      .then((results) => {
        return results.reduce((accum, val) => accum + val);
      });
  }))
    .then((results) => {
      db.Sale.create({
        sale_date: time,
        item_id: JSON.stringify(itemList),
        employee_id: employee,
        sale_amount: parseFloat(req.body.total) * multiplier,
        sale_cost: results.reduce((accum, val) => accum + val),
        sale_discount: req.body.discount,
        sale_cash: type,
        sale_type: saleType,
      }).then((results) => {
        res.send(results.dataValues);
      }).then(() => {
        db.Ingredient.findAll()
        .then((ing) => {
          ingredientsList = JSON.parse(JSON.stringify(ing));
          req.body.transactionItems.forEach((item) => {
            let ingList = JSON.parse(item.item_ingredients);
            while (typeof ingList === 'string') {
              let ingList = JSON.parse(ingList);
            }
            ingList.forEach((ing) => {
              for (let i = 0; i < ingredientsList.length; i += 1) {
                if (ingredientsList[i].id === ing.ingredient_id) {
                  let temp = JSON.parse(ingredientsList[i].ingredient_left).toFixed(2);
                  if (multiplier === -1) {
                    temp = temp + ing.ingredient_amount;
                    ingredientsList[i].ingredient_left = JSON.stringify(temp);
                  } else {
                    temp = temp - ing.ingredient_amount;
                    ingredientsList[i].ingredient_left = JSON.stringify(temp);
                  }
                }
              }
            })
          })
          ingredientsList.forEach((ing) => {
            db.Ingredient.update({
              ingredient_left: ing.ingredient_left
            },{
                where: {
                id: ing.id,
              },
            })
          })
        })
      }).catch((error) => {
        res.send(error);
      });
    });
});

app.post('/clockout', (req, res) => {
  db.Timesheet.update({
    check_out: moment().format('MM/DD/YYYY, hh:mm:ss a'),
  }, {
    where: {
      employee_id: req.session.employee,
      check_out: null,
    },
  })
    .then(() => {
      req.session.destroy();
      res.status(200).send();
    })
    .catch((error) => {
      throw error;
    });
});


app.post('/newEmployee', upload.any(), (req, res) => {
  db.Employee.create({
    employee_id: req.body.newEmployeeId,
    employee_name: req.body.newEmployeeName,
    manager_privilege: req.body.managerLevel,
    employee_img: (req.files.length > 0) ? req.files[0].location : 'http://www.sherwoodchamber.net/media/com_jbusinessdirectory/pictures/companies/0/profileicon-1487694034.png',
  })
    .then(() => {
      res.status(201).send();
    })
    .catch((error) => {
      throw error;
    });
});

app.post('/orderUp', (req, res) => {
  db.Sale.update({
    sale_ready: true,
  }, {
    where: {
      id: req.body.id,
    },
  })
    .then((response) => {
      res.status(201).send();
    })
    .catch((error) => {
      throw error;
    });
});

app.post('/addIngredient', (req, res) => {
  db.Ingredient.find({
    where: { ingredient_name: req.body.ingredientName },
  })
    .then((result) => {
      if (result === null) {
        db.Ingredient.create({
          ingredient_name: req.body.ingredientName,
          order_number: req.body.orderNumber,
          ingredient_left: req.body.orderQuantity,
          ingredient_initial: req.body.orderQuantity,
          unit_cost: req.body.unitCost,
          ingredient_expire: req.body.expireDate,
          order_date: req.body.orderDate,
          ingredient_total: req.body.totalCost,
        });
      } else {
        db.Order.create({
          order_date: req.body.orderDate,
          order_name: req.body.ingredientName,
          order_number: req.body.orderNumber,
          order_initial: req.body.orderQuantity,
          order_left: req.body.orderQuantity,
          unit_cost: req.body.unitCost,
          order_expire: req.body.expireDate,
          order_total: req.body.totalCost,
        });
      }
    })
    .then(() => {
      res.status(201).send();
    })
    .catch((error) => {
      throw error;
    });
});

app.post('/removeIngredient', (req, res) => {
  db.Ingredient.destroy({
    where: {
      ingredient_name: req.body.ingredient,
    },
  })
    .then(() => {
      res.status(201).send();
    })
    .catch((error) => {
      throw error;
    });
});

//* **************************** GET REQUESTS *********************************
// not working? attempt to redirect users who are not logged in

app.get('/fetch/currentOrders', (req, res) => {
  db.Sale.findAll({
    where: {
      sale_ready: false,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      throw error;
    });
});

app.get('/fetch/items', (req, res) => {
  db.Item.findAll()
    .then((data) => {
      res.send(data);
    }).catch((error) => {
      res.send(error);
    });
});

app.get('/fetch/items/popular', (req, res) => {
  db.Item.findAll({
    order: [['item_popularity', 'DESC']],
  })
    .then((data) => {
      res.send(data);
    }).catch((error) => {
      res.send(error);
    });
});

app.get('/fetch/categories', (req, res) => {
  db.Category.findAll()
    .then((data) => {
      res.send(data);
    }).catch((error) => {
      res.send(error);
    });
});

app.get('/fetch/ingredients', (req, res) => {
  db.Ingredient.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.send(error);
    });
});

// app.get('/fetch/items/all/ingredients', (req, res) => {
//   console.log('this is req.query', req.query)
//   db.Item.find({
//     where: {
//       id: req.query.id
//     }
//   }).then((result) => {
//     res.send(result)
//   })
// })

app.get('/fetch/items/ingredients', (req, res) => {
  let finalIngList = [];
  let ingIdList = [];
  db.Item.find({
    where: {
      id: req.query.id
    }
  })
  .then((data) => {
    let temp = JSON.parse(JSON.stringify(data))
    let ingredientList = JSON.parse(temp.item_ingredients)
    while (typeof ingredientList === 'string') {
      ingredientList = JSON.parse(ingredientList)
    }
    ingredientList.forEach(ingredient => {
      finalIngList.push(ingredient);
      ingIdList.push(ingredient.ingredient_id)
    })
  }).then(() => {
    db.Ingredient.findAll({
      where: {
        id: {
          [Op.in]: ingIdList
        }
      }
    }).then((results) => {
      results = JSON.parse(JSON.stringify(results));
      for (let i = 0; i < finalIngList.length; i ++) {
        finalIngList[i]['ingredient_name'] = results[i].ingredient_name
      }
      res.send(finalIngList);
    })
  })
});

app.get('/fetch/currentInventory', (req, res) => {
  db.Order.findAll({
    attributes: ['order_name', 'order_number', 'order_date', 'order_initial', 'order_left', 'order_expire', 'order_used'],
  }).then((data) => {
    res.send(data);
  }).catch((error) => {
    res.send(error);
  });
});

app.get('/fetch/inventory', (req, res) => {
  db.Ingredient.findAll({
    attributes: ['id', 'ingredient_name', 'order_number', 'order_date', 'ingredient_left', 'ingredient_initial', 'ingredient_expire'],
  }).then((data) => {
    res.send(data);
  }).catch((error) => {
    res.send(error);
  });
});

app.get('/fetch/ordercost', (req, res) => {
  db.Order.findAll({
    attributes: ['order_name', 'order_number', 'order_date', 'order_initial', 'unit_cost', 'order_total'],
    order: [['order_date', 'DESC']],
  }).then((data) => {
    res.send(data);
  }).catch((error) => {
    res.send(error);
  });
});

app.get('/fetch/inventorycost', (req, res) => {
  db.Ingredient.findAll({
    attributes: ['ingredient_name', 'order_number', 'order_date', 'ingredient_initial', 'unit_cost', 'ingredient_total'],
    order: [['order_date', 'DESC']],
  }).then((data) => {
    res.send(data);
  }).catch((error) => {
    res.send(error);
  });
});

app.get('/fetch/waste', (req, res) => {
  db.Order.findAll({
    attributes: ['order_name', 'order_date', 'order_number', 'order_initial', 'order_left', 'order_used'],
  }).then((data) => {
    res.send(data);
  }).catch((error) => {
    res.send(error);
  });
});

app.get('/fetch/allsales', (req, res) => {
  db.Sale.findAll({
    where: {
      sale_type: 0,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get('/fetch/recentSales', (req, res) => {
  const lastSaleID = req.query.saleID;
  if (!lastSaleID) {
    db.Sale.findAll({
      limit: 10,
      order: [['id', 'DESC']],
      where: {
        sale_type: 0,
      },
    })
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        res.send(error);
      });
  }
  db.Sale.findAll({
    limit: 10,
    order: [['id', 'DESC']],
    where: {
      sale_type: 0,
      id: {
        [Op.lt]: lastSaleID,
      },
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get('/fetch/allitems', (req, res) => {
  db.Item.findAll()
    .then((data) => {
      res.send(data);
    });
});

app.get('/fetch/employee', (req, res) => {
  let employee;
  db.Employee.findAll({
    where: {
      employee_id: req.query.PIN,
    },
  })
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send();
      } else {
        employee = JSON.parse(JSON.stringify(data));
        employee = employee[0];
        db.Timesheet.findOne({
          where: {
            employee_id: req.query.PIN,
            check_out: null,
          }
        }).then((emp) => {
          // if (!emp) {
            req.session.regenerate(() => {
              req.session.employee = req.query.PIN;
              res.send([employee])
              db.Timesheet.create({
                employee_id: req.query.PIN,
                check_in: moment().format('MM/DD/YYYY, hh:mm:ss a'),
              });
            });
          // } else {
            // db.Timesheet.update({
            //   check_out: moment().format('MM/DD/YYYY, hh:mm:ss a')
            // },{
            //   where: {check_out: null}
            // }).then(() => {
              // res.status(404).send();
            // })

          // }
        })
      }
    })

});

app.get('/fetch/employeeInfo', auth, (req, res) => {
  db.Employee.findAll({
    where: {
      employee_id: req.session.employee,
    },
  })
    .then((data) => {
      res.send(data[0]);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get('/fetch/timeSheet', auth, (req, res) => {
  db.Timesheet.findAll({
    where: {
      employee_id: req.query.employeeId,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get('/fetch/allEmployees', (req, res) => {
  db.Employee.findAll({
    order: [['employee_name', 'ASC']],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get('/fetch/allEmployees/clockedIn', (req, res) => {
  db.db.query(`SELECT a.employee_id, b.employee_name, a.check_in FROM Timesheets a INNER JOIN Employees b ON a.employee_id = b.employee_id WHERE a.check_out IS NULL AND a.check_in IS NOT NULL ORDER BY a.check_in DESC`)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get('/fetch/allSales/today', (req, res) => {
  db.Sale.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get('/filter/category', auth, (req, res) => {
  db.Item.findAll({
    where: {
      item_category: req.query.category,
    },
  })
    .then((data) => {
      res.send(data);
    });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'), (err) => {
    if (err) res.status(500).send(err);
  });
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist/index.html'), (err) => {
//     if (err) res.status(500).send(err);
//   });
// });

app.post('/cronTest', (req, res) => {
  let currentTime = JSON.stringify(moment().format());
  currentTime = currentTime.substring(1, 11)
  let currentTimeParse = Date.parse(currentTime)
  let ingredients = [];
  let orders = [];
  let expired = [];
  let items = [];
  db.Ingredient.findAll({})
    .then((ing) => {
      ingredients = ing;
    }).then(() => {
      db.Order.findAll({
        where: { order_used: false },
        order: [['order_expire', 'ASC']]
      })
        .then((order) => {
          orders = order;
          db.Item.findAll({})
          .then((menu) => {
            items = menu;
            for (let i = 0; i < ingredients.length; i += 1) {
              if (currentTimeParse > Date.parse(ingredients[i].ingredient_expire)) {
                expired.push(ingredients[i])
              }
            }

            for (let j = 0; j < expired.length; j += 1) {
              let foundIndex = orders.indexOf(orders.find((order, index) => {
                return order.order_name === expired[j].ingredient_name
              }))
              if (foundIndex === -1){
                for (let q = 0; q < items.length; q += 1) {
                  let ingredients = JSON.parse(items[q].item_ingredients);
                  let usesIngredient = ingredients.find(ing => {
                    return ing === expired[j].id
                  })
                  if(usesIngredient > -1) {
                    db.Item.update({
                      item_availability: false
                    },
                    { where: { item_name: items[q].item_name }}
                    )
                  }
                }
              } else {
                // expired item found at orders index foundIndex
                let temp = expired[j];
                db.Ingredient.update(
                  {
                    order_number: orders[foundIndex].order_number,
                    ingredient_left: orders[foundIndex].order_initial,
                    ingredient_initial: orders[foundIndex].order_initial,
                    unit_cost: orders[foundIndex].unit_cost,
                    ingredient_expire: orders[foundIndex].order_expire,
                    order_date: orders[foundIndex].order_date,
                    ingredient_total: orders[foundIndex].order_total,
                  },
                  { where: { ingredient_name: orders[foundIndex].order_name } }
                ).then(() => {
                  db.Order.update(
                    {
                    order_date: temp.order_date,
                    order_name: temp.ingredient_name,
                    order_number: temp.order_number,
                    order_initial: temp.ingredient_initial,
                    order_left: temp.ingredient_left,
                    unit_cost: temp.unit_cost,
                    order_expire: temp.ingredient_expire,
                    order_total: temp.ingredient_total,
                    order_used: 1,
                  },
                  { where: { order_number: orders[foundIndex].order_number }}
                ).then(() => {
                    res.send([orders, ingredients])
                  })
                })
              }
            }
          })
        });
    });
})


// ************************CRONJOB DONT TOUCH**********************/
const myCronJob = new CronJob('0 6 * * * *', () => {
  let currentTime = JSON.stringify(moment().format());
  currentTime = currentTime.substring(1, 11)
  let currentTimeParse = Date.parse(currentTime)
  let ingredients = [];
  let orders = [];
  let expired = [];
  let items = [];
  db.Ingredient.findAll({})
    .then((ing) => {
      ingredients = ing;
    }).then(() => {
      db.Order.findAll({
        where: { order_used: false },
        order: [['order_expire', 'ASC']]
      })
        .then((order) => {
          orders = order;
          db.Item.findAll({})
          .then((menu) => {
            items = menu;
            for (let i = 0; i < ingredients.length; i += 1) {
              if (currentTimeParse > Date.parse(ingredients[i].ingredient_expire)) {
                expired.push(ingredients[i])
              }
            }

            for (let j = 0; j < expired.length; j += 1) {
              let foundIndex = orders.indexOf(orders.find((order, index) => {
                return order.order_name === expired[j].ingredient_name
              }))
              if (foundIndex === -1){
                for (let q = 0; q < items.length; q += 1) {
                  let ingredients = JSON.parse(items[q].item_ingredients);
                  while (typeof ingredients === 'string') {
                    ingredients = JSON.parse(ingredients);
                  }
                  let usesIngredient = ingredients.find(ing => {
                    return ing === expired[j].id
                  })
                  if(usesIngredient > -1) {
                    db.Item.update({
                      item_availability: false
                    },
                    { where: { item_name: items[q].item_name }}
                    )
                  }
                }
              } else {
                // expired item found at orders index foundIndex
                let temp = expired[j];
                db.Ingredient.update(
                  {
                    order_number: orders[foundIndex].order_number,
                    ingredient_left: orders[foundIndex].order_initial,
                    ingredient_initial: orders[foundIndex].order_initial,
                    unit_cost: orders[foundIndex].unit_cost,
                    ingredient_expire: orders[foundIndex].order_expire,
                    order_date: orders[foundIndex].order_date,
                    ingredient_total: orders[foundIndex].order_total,
                  },
                  { where: { ingredient_name: orders[foundIndex].order_name } }
                ).then(() => {
                  db.Order.update(
                    {
                    order_date: temp.order_date,
                    order_name: temp.ingredient_name,
                    order_number: temp.order_number,
                    order_initial: temp.ingredient_initial,
                    order_left: temp.ingredient_left,
                    unit_cost: temp.unit_cost,
                    order_expire: temp.ingredient_expire,
                    order_total: temp.ingredient_total,
                    order_used: 1,
                  },
                  { where: { order_number: orders[foundIndex].order_number }}
                ).then(() => {
                    console.log('cronjobbeingrun')
                  })
                })
              }
            }
          })
        });
    });
}, null, true, 'America/Los_Angeles');
myCronJob.start();
// ************************NO TOUCH*******************************/
/*******SOCKET****/
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('madeSale', (sale) => {
    io.sockets.emit('madeSale', sale);
  });

  socket.on('employeeLogin', (data) => {
    io.sockets.emit('employeeLogin', data)
  })

  socket.on('employeeLogout', (employee) => {
    io.sockets.emit('employeeLogout', employee)
  })

  socket.on('alertManager', (alert)=> {
    io.sockets.emit('alertManager', alert);
  })

  socket.on('alertEmployee', (manager) => {
    io.sockets.emit('alertEmployee', manager);
  })
  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
});



/*******SOCKET****/
