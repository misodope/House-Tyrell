import React from 'react';
import { withRouter } from 'react-router';
import moment from 'moment';
import axios from 'axios';

class SaleControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dummy: 'dummy',
    }
    this.testingCron = this.testingCron.bind(this);
  };

  testingCron() {
  axios.post('/cronTest')
  // .then((res) => {
  //   let currentTime = JSON.stringify(moment().format());
  //   currentTime = currentTime.substring(1, 11)
  //   let currentTimeParse = Date.parse(currentTime)
  //   let ingredients = res.data[1]
  //   let orders = res.data[0]
  //   let expired = [];
  //
  //   for (let i = 0; i < ingredients.length; i += 1) {
  //     if (currentTimeParse > Date.parse(ingredients[i].ingredient_expire)) {
  //       expired.push(ingredients[i])
  //     }
  //   }
  //
  //   for (let j = 0; j < expired.length; j += 1) {
  //     let foundIndex = orders.indexOf(orders.find((order, index) => {
  //       return order.order_name === expired[j].ingredient_name
  //     }))
  //     if (foundIndex === -1){
  //       // not in orders
  //       // find menu items at this point that uses  this expired[j] ingredient
  //       console.log('not found', expired[j])
  //     } else {
  //       // expired item found at orders index foundIndex
  //       console.log(orders[foundIndex])
  //     }
  //   }
  //
  //   console.log(currentTime, '\n', 'ingredients\n', ingredients, '\norders ',orders, '\nexpired ', expired);
  // })
}

  render() {
    const { total, tax, transactionItems, discount, openModal, sendEmail } = this.props;
    return (
      <div className="innerSaleGrid">
        <button type="button" onClick={() => this.props.history.push('/transaction/cash', { total: ((total + tax) - ((total + tax) * (discount / 100))).toFixed(2), transactionItems, discount })}>
          Cash
        </button>
        <button type="button" onClick={() => this.props.history.push('/transaction/credit', { total: ((total + tax) - ((total + tax) * (discount / 100))).toFixed(2), transactionItems, discount })}>
          Credit
        </button>
        <button type="button" onClick={() => openModal('discountModal')}>Discount</button>
        <button type="button" onClick={() => openModal('voidModal')}>Void</button>
      </div>
    );
  }
}

export default withRouter(SaleControl);
