import React from 'react';
import Alert from 'react-s-alert';
import Pinpad from './pinpad.jsx';
import axios from 'axios'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identification: '',
      pinpadOptions: [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        'delete', 0, 'clear', 'enter',
      ],
      animation: 'wrapper noselect animated fadeIn',
      failedAttempts: 0,
    };

    this.verifyLogin = this.verifyLogin.bind(this);
    this.handlePin = this.handlePin.bind(this);
  }

  componentDidMount() {
    const hover = document.getElementById("hover");
    hover.play();
  }

  verifyLogin() {
    if(this.state.identification !== '') {
      if (this.state.identification === '1') {
        this.props.history.push('/managerHome');
      } else if (this.state.identification === '2') {
        this.props.history.push('/salesScreen');
      } else if (this.state.identification === '548') {
        this.props.history.push('/kitchenScreen');
      } else {
        axios.get(`/fetch/employee?PIN=${this.state.identification}`)
          .then((results) => {
            console.log('this is results.data', results.data)
            if (results.data[0].manager_privilege === true) {
              this.props.history.push('/managerHome');
            } else {
              //socket.emit(employeelogin)

              this.props.history.push('/salesScreen');
            }
          })
          .catch((error) => {
            if (this.state.failedAttempts < 2) {
              this.setState({ failedAttempts: this.state.failedAttempts + 1 });
              const str = `${this.state.failedAttempts} of 3 failed attempts`;
              Alert.warning(str, {
                position: 'top-right',
                effect: 'slide',
                timeout: 'none',
                html: true,
              });
            } else {
              Alert.error('Too many attempts!', {
                position: 'top-right',
                effect: 'jelly',
              });
            }
          });
      }
    }
  }

  handlePin(val) {
    Alert.closeAll();
    if (val === 'enter') {
      this.verifyLogin();
    } else if (val === 'clear') {
      this.setState({ identification: '' });
    } else if (val === 'delete') {
      const temp = this.state.identification;
      this.setState({ identification: temp.slice(0, temp.length - 1) });
    } else if (this.state.identification.length < 12) {
      const temp = this.state.identification;
      this.setState({ identification: temp + val });
    }
  }

  render() {
    return (
      <div>
        <audio id="hover">
          <source src="../sounds/237422_plasterbrain_hover-1.ogg" type="audio/ogg" />
          <source src="../sounds/237422_plasterbrain_hover-1.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <h1 >
          <div className="animated fadeIn">
            <div><img style={{ width: '50%', height: '50%'}} src='https://s3.amazonaws.com/tyrell-pos/octopus-Large.png' /></div>
            <div className="pinNumber-wrapper">
              <i className="far fa-keyboard" style={{ paddingRight: '2%' }} />
              Enter your pin
              <i className="fas fa-hashtag" style={{ paddingLeft: '2%' }} /> : <span className="pinNumber">{this.state.identification}</span>
            </div><br />
            <Pinpad
              pinpadOptions={this.state.pinpadOptions}
              handlePin={this.handlePin}
              animation={this.state.animation}
            />
            <Alert stack={{ limit: 3 }} />
          </div>
        </h1>
      </div>
    );
  }
}
