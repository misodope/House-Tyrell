import React from 'react';
import { withRouter } from 'react-router';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';
import Navbar from './navbar.jsx';

class TransactionCredit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sigConfirm: false,
    };
    this.sigCanvas = {};
    this.clear = this.clear.bind(this);
    this.finalize = this.finalize.bind(this);
  }
  clear() {
    this.sigCanvas.clear();
  }

  finalize() {
    axios.post('/completed/transaction', {
      transactionItems: this.props.location.state.transactionItems,
      total: this.props.location.state.total,
      discount: this.props.location.state.discount,
    }).then(() => {
      this.props.history.push('/salesScreen');
    })
  }

  render() {
    return (
      <div>
        <div className="navbar">
          <Navbar />
        </div>
        <div className="transactionCredit animated fadeIn">
          {
            this.state.sigConfirm === false
            ?
              <div>
                <h1>Total Sale</h1>
                <h1><i className="fas fa-dollar-sign" /> {this.props.location.state.total}</h1>
                <SignatureCanvas
                  penColor="#5959e6"
                  canvasProps={{ width: 500, height: 100, className: 'sigCanvas' }}
                  ref={(ref) => { this.sigCanvas = ref; }}
                />
                <button type="button" onClick={this.clear}>Clear Signature</button>
                <button type="button" onClick={() => this.setState({ sigConfirm: true })}>Confirm Signature</button>
              </div>
            :
              <div className="transactionCreditConfirmed animated fadeIn">
                <h1>Thank you for your purchase.</h1>
                <button type="button" onClick={this.finalize}>Email Receipt</button>
                <button type="button" onClick={this.finalize}>Print Receipt</button>
                <button type="button" onClick={this.finalize}>No Receipt</button>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default withRouter(TransactionCredit);
