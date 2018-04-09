import React from 'react';
import SaleScreen from './saleScreen.jsx';
import axios from 'axios';
import Login from './login.jsx';
import Alert from 'react-s-alert'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItems: [],
      menuCategories: [],
      transactionItems: [],
      tax: 0,
      total: 0,
      discount: 0,
      discountOptions: [],
      loading: true,
    };
    this.itemClick = this.itemClick.bind(this);
    this.getMenuItems = this.getMenuItems.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.transactionRemove = this.transactionRemove.bind(this);
    this.filterByCategory = this.filterByCategory.bind(this);
    this.removeIng = this.removeIng.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.discountModalOptions = this.discountModalOptions.bind(this);
    this.updateDiscount = this.updateDiscount.bind(this);
    this.transactionClear = this.transactionClear.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.addIng = this.addIng.bind(this);
  }

  componentDidMount() {
    this.getMenuItems();
    this.getCategories();
    this.discountModalOptions();
  }

  getMenuItems() {
    axios.get('/fetch/items')
      .then((results) => {
        this.setState({
          menuItems: results.data,
          loading: false,
        });
      });
  }

  getCategories() {
    axios.get('/fetch/categories')
      .then((results) => {
        this.setState({
          menuCategories: results.data,
          loading: false,
        });
      });
  }

  filterByCategory(category) {
    if (!category) {
      axios.get('/fetch/items')
      .then((results) => {
        this.setState({
          menuItems: results.data,
        });
      });
    } else if (category === 'popular') {
      axios.get('/fetch/items/popular')
        .then((results) => {
          this.setState({
            menuItems: results.data,
          });
        });
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
    this.getMenuItems();
    let temp = this.state.transactionItems.slice();
    let menuTemp = this.state.menuItems.slice();
    for (let i = 0; i < menuTemp.length; i +=1) {
      if (menuTemp[i].id === item.id) {
        temp.push(menuTemp[i])
      }
    }

    let tempTotal = 0;
    for (let i = 0; i < temp.length; i += 1) {
      tempTotal = tempTotal + parseFloat(temp[i].item_price)
    }
    let tempTax = (tempTotal * 0.0875).toFixed(2)

    this.setState({
      transactionItems: temp,
      total: tempTotal,
      tax: parseFloat(tempTax),
    });
  }

  removeIng(ingredient, i, crossed, index) {
      let temp = this.state.transactionItems.slice();
      let ingredientList = JSON.parse(temp[index].item_ingredients);
      for (let i = 0; i < ingredientList.length; i += 1) {
        if (ingredientList[i].ingredient_id === ingredient.ingredient_id) {
          ingredientList.splice(i, 1)
        }
      }
      temp[index].item_ingredients = JSON.stringify(ingredientList);
      this.setState({ transactionItems: temp })
  }

  addIng(ingredient, i, crossed, index) {
    let temp = this.state.transactionItems.slice();
    let ingredientList = JSON.parse(temp[index].item_ingredients);
    ingredientList.push({
      ingredient_id: ingredient.ingredient_id,
      ingredient_amount: ingredient.ingredient_amount,
    });
    temp[index].item_ingredients = JSON.stringify(ingredientList);
    this.setState({ transactionItems: temp });
  }

  transactionRemove(index) {
    const remove = this.state.transactionItems.slice();
    let tempTotal = this.state.total - remove[index].item_price;
    let tempTax = (tempTotal * 0.0875).toFixed(2)
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
    this.setState({
      transactionItems: [],
      total: 0,
      tax: 0,
      discount: 0,
    });
  }

// Below are all the functions for the discount modal and also to update discount.

  openModal(modal) {
    document.getElementById(modal).style.display = 'block';
  }

  closeModal(modal) {
    document.getElementById(modal).style.display = 'none';
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

  sendEmail() {
    axios.post('/send/email')
      .then(() => {
        console.log('works');
      })
      .catch((error) => {
        throw error;
      });
  }
  render() {
    let content;

    if (this.state.loading) {
      content = <div><img src="https://s3.amazonaws.com/tyrell-pos/octopus-loading.gif" /></div>
    } else {
      content =
      (<SaleScreen
        menuItems={this.state.menuItems}
        itemClick={this.itemClick}
        menuCategories={this.state.menuCategories}
        transactionItems={this.state.transactionItems}
        total={this.state.total}
        tax={this.state.tax}
        discount={this.state.discount}
        openModal={this.openModal}
        closeModal={this.closeModal}
        transactionRemove={this.transactionRemove}
        filterByCategory={this.filterByCategory}
        removeIng={this.removeIng}
        transactionComplete={this.transactionComplete}
        discountOptions={this.state.discountOptions}
        updateDiscount={this.updateDiscount}
        transactionClear={this.transactionClear}
        addIng={this.addIng}
      />)
    }
    return (
      <div>

        {content}

      </div>
    );
  }
}
