import React from 'react';
import SaleScreen from './saleScreen.jsx';
import axios from 'axios';
// import Login from './login.jsx';
import Alert from 'react-s-alert';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItems: [],
      menuCategories: [],
      masterMenu: [],
      masterCategories: [],
      transactionItems: [],
      tax: 0,
      total: 0,
      discount: 0,
      discountOptions: [],
      newItems: [],
      tempNewItems: [],
      newCategories: [],
      ingredients: [],
      tempMenuItems: [],
      categories: [],
      catOptions: [],
      categoryRemove: [],
      removedItems: [],
      removedCategories: [],
      tempCategories: [],
      tempNewCategories: [],
    };
    this.itemClick = this.itemClick.bind(this);
    this.getMenuItems = this.getMenuItems.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.transactionRemove = this.transactionRemove.bind(this);
    this.filterByCategory = this.filterByCategory.bind(this);
    this.removeIng = this.removeIng.bind(this);
    this.updateDiscount = this.updateDiscount.bind(this);
    this.transactionClear = this.transactionClear.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleNewItem = this.handleNewItem.bind(this);
    this.handleNewCategory = this.handleNewCategory.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.discardChanges = this.discardChanges.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getStates = this.getStates.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleRemoveConfirm = this.handleRemoveConfirm.bind(this);
    this.removeCategoryConfirm = this.removeCategoryConfirm.bind(this);
    this.confirmCategoryConfirm = this.confirmCategoryConfirm.bind(this);
  }

  componentWillMount() {
    this.getStates();
  }

  getStates() {
    axios.get('/fetch/ingredients')
      .then((ing) => {
        this.setState({
          ingredients: ing.data
        }, () => {
          axios.get('/fetch/categories')
            .then((cat) => {
              this.setState({
                categories: cat.data,
                menuCategories: cat.data,
                masterCategories: cat.data,
              }, () => {
                let temp = [];
                for (let i = 0; i < this.state.categories.length; i += 1) {
                  let obj = {};
                  obj['value'] = this.state.categories[i].category_name;
                  obj['label'] = this.state.categories[i].category_name;
                  temp.push(obj)
                }
                this.setState({ catOptions: temp }, () => {
                  axios.get('/fetch/items')
                    .then((items) => {
                      this.setState({
                        menuItems: items.data,
                        masterMenu: items.data,
                      });
                    });
                });
              });
            });
        });
      });
  }

  getCategories() {
    axios.get('/fetch/categories')
      .then((cat) => {
        this.setState({ categories: cat.data });
      });
  }

  getMenuItems() {
    axios.get('/fetch/items')
      .then((results) => {
        this.setState({
          menuItems: results.data,
        });
      });
  }

  getCategories() {
    axios.get('/fetch/categories')
      .then((results) => {
        this.setState({
          menuCategories: results.data,
        });
      });
  }

  filterByCategory(category) {
    if (!category) {
      axios.get('/fetch/items')
      .then((results) => {
        this.setState({
          menuItems: results.data,
        })
      })
    } else {
    axios.get('/filter/category', { params: { category: category.id } })
      .then((results) => {
        this.setState({
          menuItems: results.data,
        })
      })
      .catch((error) => {
        throw error;
      });
    }
  }

  itemClick(item) {
    const temp = this.state.transactionItems.slice();
    temp.push(item);
    let tempTotal = 0;
    for (let i = 0; i < temp.length; i += 1) {
      tempTotal = tempTotal + parseFloat(temp[i].item_price)
    }
    let tempTax = (tempTotal * 0.0875).toFixed(2);

    this.setState({
      transactionItems: temp,
      total: tempTotal,
      tax: parseFloat(tempTax),
    });
  }

  removeIng(ingredient, i, crossed) {
      console.log('this is ingredient and index of ingredient', ingredient, i, crossed);
  }

  transactionRemove(index) {
    const remove = this.state.transactionItems.slice();
    let tempTotal = this.state.total - remove[index].item_price;
    let tempTax = (tempTotal * 0.0875).toFixed(2);
    remove.splice(index, 1);
    this.setState({
      transactionItems: [],
      total: 0,
      tax: 0,
    }, () => this.setState({
      transactionItems: remove,
      total: tempTotal,
      tax: parseFloat(tempTax),
    }));
  }

  transactionClear() {
    this.setState({ transactionItems: [] })
  }



// Below are all the functions for the discount modal and also to update discount.
  openModal(modal) {
    document.getElementById(modal).style.display='block';
  }
  closeModal(modal) {
    document.getElementById(modal).style.display='none';
  }

  handleNewItem(item) {
    let temp = this.state.newItems.slice();
    temp.push(item);
    this.setState({ newItems: temp });
  }

  handleNewCategory(category) {
    let temp = this.state.newCategories.slice();
    temp.push(category);
    this.setState({ newCategories: temp });
  }

  removeItem(item) {
    // check if item is in menuItems or newItems by checking if object has id
    // splice out of either array
    let removed = this.state.removedItems.slice();
    let temp = this.state.menuItems.slice();
    if (item.id) {
      for (let i = 0; i < temp.length; i += 1) {
        if (temp[i].item_name === item.item_name) {
          removed.push(temp[i]);
          temp.splice(i, 1);
        }
      }
      this.setState({ tempMenuItems: temp, removedItems: removed }, () => {
        this.openModal('removeItemModal');
      })
    } else {
      let tempp = this.state.newItems.slice();
      for (let i = 0; i < tempp.length; i += 1) {
        if (tempp[i].item_name === item.item_name) {
          removed.push(tempp[i]);
          tempp.splice(i, 1);

        }
      }
      this.setState({ tempMenuItems: tempp, removedItems: removed }, () => {
        this.openModal('removeItemModal');
      })
    }
  }

  handleRemoveConfirm() {
    let temp = this.state.tempMenuItems.slice();
    let newItemTemp = this.state.tempNewItems.slice();
    let removed = this.state.removedItems.slice();
    if (temp.length > 0) {
      this.setState({
         menuItems: temp,
       }, () => {
        this.setState({ tempMenuItems: [] }, () => {
          this.closeModal('removeItemModal');
        });
      });
    } else {
      this.setState({
        newItems: newItemTemp,
      }, () => {
        this.setState({ tempNewItems: [] }, () => {
          this.closeModal('removeItemModal');
        });
      });
    }
  }

  removeCategoryConfirm(category) {
    let temp = [];
    let categories = this.state.menuCategories.slice();
    let newCategories = this.state.newCategories.slice();
    temp.push(category);

    for (let i = 0 ; i < categories.length; i += 1) {
      if (category.category_name === categories[i].category_name) {
        categories.splice(i, 1);
      }
    }
    for (let i = 0; i < newCategories.length; i += 1) {
      if (category.category_name === newCategories[i].category_name) {
        newCategories.splice(i, 1);
      }
    }

    this.setState({ categoryRemove: temp, tempCategories: categories, tempNewCategories: newCategories }, () => {
      this.openModal('removeCatModal');
    })
  }

  confirmCategoryConfirm() {
    let newCatList = this.state.tempCategories.slice();
    let remove = this.state.categoryRemove.slice();
    let updatedRemove = this.state.removedCategories.slice();
    let temp = this.state.tempNewCategories.slice();
    updatedRemove.push(remove[0]);


    this.setState({
      menuCategories: newCatList,
      removedCategories: updatedRemove,
      newCategories: temp,
      }, () => {
       this.closeModal('removeCatModal');
    })

  }


  saveChanges() {
    let items = this.state.newItems.slice();
    let categories = this.state.newCategories.slice();
    let removeItems = this.state.removedItems.slice();
    let removeCategories = this.state.removedCategories.slice();
    for (let i = 0; i < items.length; i += 1) {
      let formData = new FormData();
      items[i].item_ingredients = '' + JSON.stringify(items[i].item_ingredients)
      formData.append('item_name', items[i].item_name);
      formData.append('item_price', items[i].item_price);
      formData.append('item_ingredients', items[i].item_ingredients);
      formData.append('item_category', items[i].item_category);
      axios.post('/create/item', formData);
    }

    for (let j = 0; j < categories.length; j += 1) {
      axios.post('/create/category', categories[j]);
    }


    for (let q = 0; q < removeItems.length; q += 1) {
      axios.post('/delete/item', removeItems[q]);
    }

    for (let w = 0; w < removeCategories.length; w += 1) {
      axios.post('/delete/category', removeCategories[w]);
    }

    //loop through new items, create new item entry for each
    //loop through new categories, create new category entry for each

  }

  discardChanges() {
    let tempMenu = this.state.masterMenu.slice();
    let tempCat = this.state.masterCategories.slice();
    this.setState({
      newItems: [],
      newCategories: [],
      menuItems: tempMenu,
      menuCategories: tempCat,
      removedItems: [],
      removedCategories: []
    });
  }


  discountModalOptions() {
    const myOptions = [];
    for (let i = 0; i <= 100; i += 1) {
      myOptions.push({ value: i, label: i });
    }
    this.setState({
      discountOptions: myOptions,
    });
  }

  updateDiscount(discount) {
    this.setState({
      discount,
    });
  }
  render() {
    return (
      <div>

        <SaleScreen
          menuItems={this.state.newItems.concat(this.state.menuItems)}
          itemClick={this.itemClick}
          menuCategories={this.state.newCategories.concat(this.state.menuCategories)}
          transactionItems={this.state.transactionItems}
          total={this.state.total}
          tax={this.state.tax}
          discount={this.state.discount}
          transactionRemove={this.transactionRemove}
          filterByCategory={this.filterByCategory}
          removeIng={this.removeIng}
          transactionComplete={this.transactionComplete}
          discountOptions={this.state.discountOptions}
          updateDiscount={this.updateDiscount}
          transactionClear={this.transactionClear}
          getMenuItems={this.getMenuItems}
          getCategories={this.getCategories}
          openModal={this.openModal}
          closeModal={this.closeModal}
          handleNewItem={this.handleNewItem}
          handleNewCategory={this.handleNewCategory}
          saveChanges={this.saveChanges}
          discardChanges={this.discardChanges}
          categories={this.state.categories}
          ingredients={this.state.ingredients}
          catOptions={this.state.catOptions}
          removeItem={this.removeItem}
          handleRemoveConfirm={this.handleRemoveConfirm}
          removeCategoryConfirm={this.removeCategoryConfirm}
          confirmCategoryConfirm={this.confirmCategoryConfirm}
        />

      </div>
    );
  }
}
