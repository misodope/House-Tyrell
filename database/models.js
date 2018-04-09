const Sequelize = require('sequelize');
const {
  DB_NAME, DB_PORT, DB_UN, DB_PW, DB_URL, READ_DB_URL,
} = require('../config.js');

const db = new Sequelize(DB_NAME, null, null, {
  dialect: 'mysql',
  port: DB_PORT,
  replication: {
    read: [
      { host: READ_DB_URL, username: DB_UN, password: DB_PW },
      { host: DB_URL, username: DB_UN, password: DB_PW },
    ],
    write: { host: DB_URL, username: DB_UN, password: DB_PW },
  },
});

const Employee = db.define('Employees', {
  employee_id: Sequelize.INTEGER,
  employee_img: Sequelize.STRING,
  manager_password: Sequelize.STRING,
  manager_privilege: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  employee_name: Sequelize.STRING,
});

const Item = db.define('Items', {
  item_name: Sequelize.STRING,
  item_price: Sequelize.DECIMAL(10,2),
  item_image: Sequelize.STRING,
  item_ingredients: Sequelize.STRING(10000),
  item_category: Sequelize.INTEGER,
  item_availability: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  item_popularity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
});

const Category = db.define('Categories', {
  category_name: Sequelize.STRING,
});

const Sale = db.define('Sales', {
  sale_date: Sequelize.STRING,
  item_id: Sequelize.STRING,
  employee_id: Sequelize.INTEGER,
  sale_amount: Sequelize.DECIMAL(10,2),
  sale_cost: Sequelize.DECIMAL(10,2),
  sale_discount: Sequelize.INTEGER,
  sale_cash: Sequelize.BOOLEAN,
  sale_ready: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  sale_type: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
});

const Ingredient = db.define('Ingredients', {
  ingredient_name: Sequelize.STRING,
  order_number: Sequelize.STRING,
  ingredient_left: Sequelize.DECIMAL(10,2),
  ingredient_initial: Sequelize.DECIMAL(10,2),
  unit_cost: Sequelize.DECIMAL(10,2),
  ingredient_expire: Sequelize.STRING,
  order_date: Sequelize.STRING,
  ingredient_total: Sequelize.DECIMAL(10,2),
});

const Order = db.define('Orders', {
  order_date: Sequelize.STRING,
  order_name: Sequelize.STRING,
  order_number: Sequelize.STRING,
  order_initial: Sequelize.DECIMAL(10,2),
  order_left: Sequelize.DECIMAL(10,2),
  unit_cost: Sequelize.DECIMAL(10,2),
  order_expire: Sequelize.STRING,
  order_total: Sequelize.DECIMAL(10,2),
  order_used: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
});

const Timesheet = db.define('Timesheets', {
  employee_id: Sequelize.INTEGER,
  check_in: Sequelize.STRING,
  check_out: Sequelize.STRING,
});

const Voiditem = db.define('Voiditems', {
  void_date: Sequelize.STRING,
  employee_id: Sequelize.INTEGER,
  order_number: Sequelize.STRING,
  void_items: Sequelize.STRING,
});
//
//
// db.sync({ force: true }).then(() => {
//   Employee.create({
//     employee_id: '5', employee_name: 'Manos', employee_img: 'https://avatars3.githubusercontent.com/u/32654968?s=460&v=4', manager_privilege: true,
//   });
//   Employee.create({
//     employee_id: '95', employee_name: 'Eric', employee_img: 'https://avatars3.githubusercontent.com/u/32647671?s=400&u=7b3abb436a9b17e8c2da951015f41967ba58e808&v=4', manager_privilege: true,
//   });
//   Employee.create({
//     employee_id: '93', employee_name: 'Jerry', employee_img: 'https://avatars2.githubusercontent.com/u/29716220?s=460&v=4', manager_privilege: true,
//   });
//   Employee.create({
//     employee_id: '88', employee_name: 'Xixi', employee_img: 'https://avatars2.githubusercontent.com/u/31266066?s=460&v=4', manager_privilege: true,
//   });
//   Employee.create({
//     employee_id: '400', employee_name: 'Adam', employee_img: 'https://media.licdn.com/dms/image/C5603AQESXK5y_CFecQ/profile-displayphoto-shrink_800_800/0?e=1526958000&v=alpha&t=iYNrBoRdR-6nKxPN8ZA76GfYAXWmi3aEmp9pWBAMTns', manager_privilege: false,
//   });
//   Ingredient.create({
//     ingredient_name: 'Ground Beef', order_number: 'A501', ingredient_left: 5.5, ingredient_initial: 10.5, unit_cost: 5, ingredient_expire: '2018/03/21', ingredient_total: 500, order_date: '2018/02/27',
//   });
//   Ingredient.create({
//     ingredient_name: 'Lettuce', order_number: 'A601', ingredient_left: 5.5, ingredient_initial: 10.5, unit_cost: 0.10, ingredient_expire: '2018/03/25', ingredient_total: 300.51, order_date: '2018/02/27',
//   });
//   Ingredient.create({
//     ingredient_name: 'Tomatoes', order_number: 'A103', ingredient_left: 5.5, ingredient_initial: 10.5, unit_cost: 0.25, ingredient_expire: '2018/03/25', ingredient_total: 500.55, order_date: '2018/01/27',
//   });
//   Ingredient.create({
//     ingredient_name: 'Onions', order_number: 'A923', ingredient_left: 5.5, ingredient_initial: 10.5, unit_cost: 0.15, ingredient_expire: '2018/03/25', ingredient_total: 36.55, order_date: '2018/03/27',
//   });
//   Ingredient.create({
//     ingredient_name: 'Pickles', order_number: 'A888', ingredient_left: 5.5, ingredient_initial: 10.5, unit_cost: 0.5, ingredient_expire: '2018/03/25', ingredient_total: 300.32, order_date: '2018/03/27',
//   });
//   Ingredient.create({
//     ingredient_name: 'Ketchup', order_number: 'A113', ingredient_left: 5.5, ingredient_initial: 10.5, unit_cost: 1, ingredient_expire: '2018/03/25', ingredient_total: 200.50, order_date: '2017/12/27',
//   });
//   Ingredient.create({
//     ingredient_name: 'Coca-Cola Cans', order_number: 'A12', ingredient_left: 80, ingredient_initial: 100, unit_cost: 0.10, ingredient_expire: '2018/03/25', ingredient_total: 313.23, order_date: '2017/11/27',
//   });
//   Category.create({
//     category_name: 'Drinks',
//   });
//   Category.create({
//     category_name: 'Burgers',
//   });
//   Category.create({
//     category_name: 'Salad',
//   });
//   Category.create({
//     category_name: 'Soup',
//   });
//   Category.create({
//     category_name: 'Steak',
//   });
//   Category.create({
//     category_name: 'Breakfast',
//   });
//   Item.create({
//     item_name: 'Hamburger', item_price: 5.50, item_image: 'https://www.rallys.com/wp-content/uploads/2017/03/BigBuford_Feature_1000x1000-600x600.jpg', item_ingredients: JSON.stringify([{ingredient_id: 1, ingredient_amount: 0.2}, {ingredient_id: 2, ingredient_amount: 0.3}, {ingredient_id: 3, ingredient_amount: 0.4}, {ingredient_id: 4, ingredient_amount: 0.1}, {ingredient_id: 5, ingredient_amount: 0.34}, {ingredient_id: 6, ingredient_amount: 0.21}]), item_category: 2,
//   });
//   Item.create({
//     item_name: 'Coca-Cola', item_price: 1, item_image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY2B_5VgeOlPdpGZLz3H4SBmazfFS1gsoxtcBddF0awQux3EiY', item_ingredients: JSON.stringify([{ingredient_id: 7, ingredient_amount: 0.5}]), item_category: 1,
//   });
//   Item.create({
//     item_name: 'Basic Salad', item_price: 6, item_image: 'https://recipes.heart.org/-/media/aha/recipe/recipe-images/mediterranean-salad.jpg', item_ingredients: JSON.stringify([{ingredient_id: 2, ingredient_amount: 0.25}, {ingredient_id: 3, ingredient_amount: 0.15}, {ingredient_id: 4, ingredient_amount: 0.32}]), item_category: 3,
//   });
//   Item.create({
//     item_name: 'Chicken Noodle Soup', item_price: 4, item_ingredients: JSON.stringify([{ingredient_id: 6, ingredient_amount: 0.3}]), item_category: 4,
//   });
//   Item.create({
//     item_name: 'Egg and Cheese Sandwich', item_price: 3, item_ingredients: JSON.stringify([{ingredient_id: 6, ingredient_amount: 0.25}]), item_category: 6,
//   });
//   Order.create({
//     order_date: '2017/05/04', order_name: 'Ground Beef', order_number: 'A55', order_initial: 21, order_left: 6, unit_cost: 18, order_expire: '2018/06/25', order_total: 313.23,
//   });
//   Order.create({
//     order_date: '2017/09/04', order_name: 'Lettuce', order_number: 'A665', order_initial: 50, order_left: 29, unit_cost: 1, order_expire: '2018/03/25', order_total: 311.23,
//   });
//   Order.create({
//     order_date: '2017/10/04', order_name: 'Pickles', order_number: 'A6665', order_initial: 14, order_left: 2, unit_cost: 3.6, order_expire: '2018/06/25', order_total: 113.53,
//   });
//   Order.create({
//     order_date: '2017/11/04', order_name: 'Onions', order_number: 'A346', order_initial: 100, order_left: 70, unit_cost: 2.2, order_expire: '2018/05/25', order_total: 353.23,
//   });
//   Order.create({
//     order_date: '2017/12/04', order_name: 'Coca-Cola Cans', order_number: 'A346', order_initial: 90, order_left: 15, unit_cost: 1.8, order_expire: '2018/02/25', order_total: 33.63, order_used: true,
//   });
//   Order.create({
//     order_date: '2018/01/04', order_name: 'Ground Beef', order_number: 'A3569', order_initial: 8, order_left: 4, unit_cost: 20, order_expire: '2018/04/25', order_total: 373.23,
//   });
//   Order.create({
//     order_date: '2017/08/04', order_name: 'Tomatoes', order_number: 'A4310', order_initial: 35, order_left: 15, unit_cost: 9, order_expire: '2018/02/25', order_total: 913.23, order_used: true,
//   });
//   Order.create({
//     order_date: '2017/06/04', order_name: 'Ketchup', order_number: 'A4411', order_initial: 200, order_left: 45, unit_cost: 1.5, order_expire: '2018/03/25', order_total: 313.23,
//   });
//   Order.create({
//     order_date: '2017/07/04', order_name: 'Ground Beef', order_number: 'A45611', order_initial: 55, order_left: 2, unit_cost: 18, order_expire: '2018/02/25', order_total: 213.23, order_used: true,
//   });
// });

exports.Employee = Employee;
exports.Item = Item;
exports.Category = Category;
exports.Sale = Sale;
exports.Ingredient = Ingredient;
exports.Order = Order;
exports.Timesheet = Timesheet;
exports.Voiditem = Voiditem;
exports.db = db;
