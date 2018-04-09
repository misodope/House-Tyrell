import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';''
import Navbar from './navbar.jsx';
import socket from '../socket.js';
import sendReceipt from '../../helpers/sendEmail.js';

class TransactionCashConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'cash',
      emailReceipt: false,
      emailAddress: '',
    };
    this.finalize = this.finalize.bind(this);
  }


  finalize(email) {
    if (email) {
      sendReceipt(this.props.location.state.transactionItems, this.props.location.state.total, email);
      this.setState({
        emailReceipt: false,
        emailAddress: '',
      });
    }
    axios.post('/completed/transaction', {
      transactionItems: this.props.location.state.transactionItems,
      total: this.props.location.state.total,
      tendered: this.props.location.state.tendered,
      discount: this.props.location.state.discount,
      type: this.state.type,
    }).then((results) => {
      socket.emit('madeSale',
        {
          id: results.data.id,
          total: results.data.sale_amount,
          employee_id: results.data.employee_id,
          item_id: results.data.item_id, //[1,1,1]
          sale_date: results.data.sale_date,
          tendered: this.props.location.state.tendered,
          sale_discount: results.data.sale_discount,
          sale_type: results.data.sale_type,
          type: this.state.type,
          transactionList: this.props.location.state.transactionItems,
        }
      );
      this.props.history.push('/salesScreen');
    });
  }

  render() {
    return (
      <div className="transactionCashConfirm animated fadeIn">
        <div>
          {
            this.state.emailReceipt === false
            ?
              <div>
                <h1>Total Sale</h1>
                <h1><i className="fas fa-dollar-sign" /> {this.props.location.state.total}</h1>
                <h1>Tendered: </h1>
                <h1><i className="fas fa-dollar-sign" /> {this.props.location.state.tendered}</h1>
                <h1>Change: </h1>
                <h1><i className="fas fa-dollar-sign" /> {(this.props.location.state.tendered - this.props.location.state.total).toFixed(2)}</h1>
                <h1>Thank you for your purchase</h1>
                <div>
                  <button type="button" onClick={() =>  this.setState({ emailReceipt: true })}>Email Receipt</button>
                  <button type="button" onClick={this.finalize}>Print Receipt</button>
                  <button type="button" onClick={this.finalize}>No Receipt</button>
                </div>
              </div>
            :
            <div className="transactionCreditConfirmed animated fadeIn">
              <h1>Please enter your e-mail.</h1>
              <input type="text" placeholder="Enter your e-mail address" onChange={e => this.setState({ emailAddress: e.target.value })}/>
              <button type="button" onClick={() => this.finalize(this.state.emailAddress)}>Send Receipt</button>
            </div>
          }

        </div>
      </div>
    );
  }
}

export default withRouter(TransactionCashConfirm);
