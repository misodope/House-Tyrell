import React from 'react';
import { withRouter } from 'react-router';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';
import Alert from 'react-s-alert';
import Pinpad from './pinpad.jsx';
import Navbar from './navbar.jsx';

class TransactionCash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sigConfirm: false,
      identification: '',
      pinpadOptions: [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        '.', 0, 'clear', 'enter',
      ],
      animation: 'wrapper noselect animated fadeIn',
      failedAttempts: 0,
      pinpadOn: false,
      tendered: '',
      completed: false,
      decimal: false,
    };

    this.clear = this.clear.bind(this);
    this.transactionComplete = this.transactionComplete.bind(this);
    this.handlePin = this.handlePin.bind(this);
    this.verifyTotal = this.verifyTotal.bind(this);
    this.togglePinpad = this.togglePinpad.bind(this);
  }
  clear() {
    this.sigCanvas.clear();
  }

  verifyTotal() {
    this.setState({
      tendered: (this.state.tendered === '')? '' : parseFloat(this.state.tendered).toFixed(2),
      completed: !this.state.completed,
      pinpadOn: !this.state.pinpadOn
    });

  }

  transactionComplete() {
    console.log("TESTTTT", this.props.location.state.test);
  }

  togglePinpad() {
    this.setState({ pinpadOn: !this.state.pinpadOn })
  }

  handlePin(val) {
    Alert.closeAll()
    if (val === 'enter') {
      this.verifyTotal();
    } else if (val === 'clear') {
      this.setState({ tendered: '', decimal: false })
    } else if (this.state.tendered.length < 12) {
      if (val === '.') {
        if (this.state.decimal === false) {
          const temp = this.state.tendered;
          this.setState({ decimal: !this.state.decimal }, () => this.setState({ tendered: temp + val }))
        }
      } else {
        const temp = this.state.tendered;
        this.setState({ tendered: temp + val })
      }
    }
  }

  render() {
    return (
      <div>
        <div className="navbar">
          <Navbar />
        </div>
        <div className="transactionCash animated fadeIn">
          <div>
            <div>
              <h1>Total Sale</h1>
              <h1><i className="fas fa-dollar-sign" /> {this.props.location.state.total}</h1>
              <h1>Tendered: </h1>
              <h1><i className="fas fa-dollar-sign" /> {this.state.tendered}</h1>
            </div>
              <div className="transactionCashConfirmed animated fadeIn">
                {this.state.pinpadOn ?
                  <Pinpad
                    pinpadOptions={this.state.pinpadOptions}
                    handlePin={this.handlePin}
                    animation={this.state.animation}
                  />
                  :
                  <div className="pinNumber-wrapper"  onClick={this.togglePinpad}>Tendered:<i className="far fa-keyboard"></i> <span className="pinNumber">{this.state.identification}</span></div>
                }
              </div>
            <button
              type="button"
              onClick={() => this.props.history.push('/transaction/cash/confirm', { total: this.props.location.state.total, tendered: this.state.tendered, transactionItems: this.props.location.state.transactionItems, discount: this.props.location.state.discount })}>Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }
}
/*


this.state.pinpadOn ?
  <Pinpad
    pinpadOptions={this.state.pinpadOptions}
    handlePin={this.handlePin}
    animation={this.state.animation}/>




*/

export default withRouter(TransactionCash);
