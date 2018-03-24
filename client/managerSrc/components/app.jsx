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
    };
    this.itemClick = this.itemClick.bind(this);
    this.getMenuItems = this.getMenuItems.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.transactionRemove = this.transactionRemove.bind(this);
    this.filterByCategory = this.filterByCategory.bind(this);
    this.removeIng = this.removeIng.bind(this);
    this.openDiscountModal = this.openDiscountModal.bind(this);
    this.closeDiscountModal = this.closeDiscountModal.bind(this);
    this.discountModalOptions = this.discountModalOptions.bind(this);
    this.updateDiscount = this.updateDiscount.bind(this);
    this.openItemModal = this.openItemModal.bind(this);
    this.closeItemModal = this.closeItemModal.bind(this);
    this.transactionClear = this.transactionClear.bind(this);
    this.openCategoryModal = this.openCategoryModal.bind(this);
    this.closeCategoryModal = this.closeCategoryModal.bind(this);
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
          menuCategories: this.state.menuCategories.reverse(),
        });
      });
  }

  getCategories() {
    axios.get('/fetch/categories')
      .then((results) => {
        this.setState({
          menuItems: this.state.menuItems.reverse(),
          menuCategories: results.data,
        });
      });
  }

  filterByCategory(category) {
    if (!category) {
      axios.get('/fetch/items')
      .then((results) => {
        this.setState({
          menuItems: results.data
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
    let tempTax = (tempTotal * 0.0875).toFixed(2)

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
    }))
  }

  transactionClear() {
    this.setState({ transactionItems: [] })
  }

  

// Below are all the functions for the discount modal and also to update discount.

  openDiscountModal() {
    document.getElementById('itemModal').style.display = 'block';
  }

  closeDiscountModal() {
    document.getElementById('itemModal').style.display = 'none';
  }

  openCategoryModal() {
    document.getElementById('categoryModal').style.display = 'block';
  }

  closeCategoryModal() {
    document.getElementById('categoryModal').style.display = 'none';
  }

  openItemModal() {
    document.getElementById('itemModal').style.display = 'block';
  }

  closeItemModal() {
    document.getElementById('itemModal').style.display = 'none';
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
          menuItems={this.state.menuItems.reverse()}
          itemClick={this.itemClick}
          menuCategories={this.state.menuCategories.reverse()}
          transactionItems={this.state.transactionItems}
          total={this.state.total}
          tax={this.state.tax}
          discount={this.state.discount}
          openDiscountModal={this.openDiscountModal}
          closeDiscountModal={this.closeDiscountModal}
          transactionRemove={this.transactionRemove}
          filterByCategory={this.filterByCategory}
          removeIng={this.removeIng}
          transactionComplete={this.transactionComplete}
          discountOptions={this.state.discountOptions}
          updateDiscount={this.updateDiscount}
          openOptionModal={this.openOptionModal}
          closeOptionModal={this.closeOptionModal}
          closeItemModal={this.closeItemModal}
          openItemModal={this.openItemModal}
          transactionClear={this.transactionClear}
          openCategoryModal={this.openCategoryModal}
          closeCategoryModal={this.closeCategoryModal}
          getMenuItems={this.getMenuItems}
          getCategories={this.getCategories}
        />

      </div>
    );
  }
}
