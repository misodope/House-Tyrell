import React from 'react';
import axios from 'axios';
import OrderKitchenView from './orderKitchenView.jsx';
import socket from '../socket.js';
import Navbar from './navbar.jsx';

export default class KitchenLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ordersPlaced: [],
      menuItems: [],
      ingredients: [],
    };
    this.orderUp = this.orderUp.bind(this);
    // this.getOrders = this.getOrders.bind(this);
    this.getMenuItems = this.getMenuItems.bind(this);
    this.getIngredients = this.getIngredients.bind(this);
  }

  componentDidMount() {
    this.initSocket();
    this.getMenuItems();
    this.getIngredients();
  }

  getMenuItems() {
    // populates menuItems state with the menu details
    axios.get('/fetch/items')
      .then((results) => {
        // let menuItems = results.data.map(item => {
        //   return {
        //     id: item.id,
        //     item_name: item.item_name,
        //     ingredients:
        //       JSON.parse(item.item_ingredients)
        //         .map(item => item.ingredient_id)
        //   }
        // })
        this.setState({
          menuItems:
            results.data.map(item => {
              return {
                id: item.id,
                item_name: item.item_name,
                ingredients:
                  JSON.parse(item.item_ingredients)
                    .map(item => item.ingredient_id)
              }
            })
        }, () => console.log('menu items with ingredients:',this.state.menuItems))
        // this.setState({
        //   menuItems: results.data,
        // }, () => {
        //   console.log('menu items state', this.state.menuItems)
        //   console.log('string ingredients', JSON.parse(this.state.menuItems[0].item_ingredients).map(item => item.ingredient_id))
        // });

        // this.getOrders();
      });
  }

  getIngredients() {
    // populates ingredients state with ingredient codes to strings
    axios.get('/fetch/ingredients')
      .then((ingredients) => {
        console.log('ingredients from axios:', ingredients)
        this.setState({
          ingredients: ingredients.data.reduce((lib, ingredient) => {
            lib[ingredient.id] = ingredient.ingredient_name
            return lib
          }, {})
        }, () => console.log('ingredients set:',this.state.ingredients))
      })
  }

  // getOrders() {
  //   axios.get('/fetch/currentOrders')
  //     .then((sales) => {
  //       this.setState({
  //         ordersPlaced: sales.data,
  //       });
  //     });
  // }

  orderUp(orderNum) {
    // orderNum got clicked, set to ready in db
    axios.post('/orderUp', {
      id: orderNum,
    })
      .then((response) => {
        this.getOrders();
      });
  }

  initSocket() {
   socket.on('madeSale', (sale) => {
     console.log('socket sale', sale);
     let ordersPlaced = this.state.ordersPlaced;
     ordersPlaced.push({
      id: sale.id,
      sale_date: sale.sale_date,
      foods: sale.transactionList.map(item => {
        return [
          item.item_name,
          this.state.menuItems
            .find(menu => {
              return menu.id === item.id
            })
            .ingredients.filter(code => {
              return !JSON.parse(item.item_ingredients)
                .map(ingObj => ingObj.ingredient_id)
                .includes(code)
            })
            .map(code => {
              return this.state.ingredients[code]
            })
         ]
       })
     })
     // ordersPlaced.push({ id: sale.id, sale_date: sale.sale_date, item_id: sale.item_id });
     this.setState({
       ordersPlaced,
     }, () => {
       // console.log('orders placed updated:',ordersPlaced,'item id is', typeof ordersPlaced[0].item_id, ' = ', JSON.parse(ordersPlaced[0].item_id)[0])
     });
   });
 }

  render() {
    return (
      <div>
        <div style={{ marginBottom: '1%' }}><Navbar /></div>
        <div className="kitchenGridContainer noselect">
          {this.state.ordersPlaced.map(order =>
            (<div>
              <OrderKitchenView
                orderUp={this.orderUp}
                number={order.id}
                time={order.sale_date}
                foods={order.foods}
                // foods={
                //   order.transactionList.item_name
                // }
                // foods={
                //   JSON.parse(order.item_id)
                //     .map(idOrdered =>
                //       this.state.menuItems
                //         .find(item => item.id === idOrdered).item_name
                //     )
                // }
                // without={
                //   order.
                //   JSON.parse(order.item_ingredients)
                //     .map(itemObj => this.state.ingredients[itemObj.ingredient_id])
                // }
              />
            </div>))}
        </div>
      </div>
    );
  }
}
