import React from 'react';
import Moment from 'react-moment';
import axios from 'axios';
import { withRouter } from 'react-router';
import moment from 'moment';
import socket from '../socket.js'
import NotificationModal from './notificationModal.jsx';
class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isManager: false,
      employeeName: '',
      alerts: [],
      employeeId: '',
      notifications: [],
    }
    this.openNav = this.openNav.bind(this);
    this.closeNav = this.closeNav.bind(this);
    this.clockout = this.clockout.bind(this);
    this.onEmployeeLogin = this.onEmployeeLogin.bind(this);
    this.onUnload = this.onUnload.bind(this);
    this.notice = this.notice.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.alertManager = this.alertManager.bind(this);
    this.initSocket = this.initSocket.bind(this);
    this.alertEmployee = this.alertEmployee.bind(this);
    this.employeeAcknowledge = this.employeeAcknowledge.bind(this);
  }

  componentWillMount() {
    this.onEmployeeLogin();
    this.initSocket();
    window.addEventListener("beforeunload", this.onUnload)
  }

  componentDidMount() {
    this.onEmployeeLogin();
  }

  onUnload(event) {
    socket.emit('employeeLogout',{employee_name: this.state.employeeName})
    axios.post('/clockout')
  }

  initSocket() {
    socket.on('alertManager', (alert)=> {
      let temp = this.state.alerts.slice();
      temp.push(alert)
      this.setState({ alerts: temp }, () => {console.log('this is alerts list', this.state.alerts)})
    })

    socket.on('alertEmployee', (alert) => {
      let temp = this.state.notifications.slice();
      temp.push(alert)
      this.setState({ notifications: temp }, () => this.notice())
    })
  }


  openNav() {
    document.getElementById('mySidenav').style.width = '250px';
  }

  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
  }

  clockout() {
    socket.emit('employeeLogout', {employee_name: this.state.employeeName})
    axios.post('/clockout')
      .then(() => {
        this.props.history.push('/');
      })
      .catch((error) => {
        throw error;
      })
  }

  onEmployeeLogin() {
    axios.get('/fetch/employeeInfo', ({}))
      .then((results) => {
        console.log('this is employee info', results.data, results.data.manager_privilege)
        this.setState({
          employeeName: results.data.employee_name,
          isManager: results.data.manager_privilege,
          employeeId: results.data.employee_id,
        }, () => {
          console.log('this is state', this.state.isManager)
          socket.emit('employeeLogin', {
            employee_id: results.data.employee_id,
            employee_name: results.data.employee_name,
            check_in: moment().format('MM/DD/YYYY, hh:mm:ss a')
          })
        });
      })
      .catch((error) => {
        throw error;
      });
  }

  notice() {
    document.getElementById('notificationModal').style.display = 'block';
  }

  closeNotification() {
    document.getElementById('notificationModal').style.display = 'none';
  }

  alertManager() {
    if (!this.state.isManager) {
      socket.emit('alertManager', {
        employee_name: this.state.employeeName,
        employee_id: this.state.employeeId,
        time: moment().format('MM/DD/YYYY, hh:mm:ss a'),
      })
    }
  }

  alertEmployee(index) {
    socket.emit('alertEmployee', {
      employee_name: this.state.employeeName,
      employee_id: this.state.employeeId,
      time: moment().format('MM/DD/YYYY, hh:mm:ss a'),
    })
    let temp = this.state.alerts.slice();
    temp.splice(index, 1)
    this.setState({ alerts: temp }, () => {
      console.log('this is alerts list after clicking on the x', this.state.alerts)
    })
  }

  employeeAcknowledge(index) {
    let temp = this.state.notifications.slice();
    temp.splice(index, 1)
    this.setState({ notifications: temp })
  }



  render() {
    return (
      <div className="navbar">
        <NotificationModal
          closeNotification={this.closeNotification}
          alerts={this.state.alerts}
          alertEmployee={this.alertEmployee}
          notifications={this.state.notifications}
          isManager={this.state.isManager}
          employeeAcknowledge={this.employeeAcknowledge}
        />
        <span className="navbar-bars"style={{fontSize:"30px", cursor:"pointer"}} onClick={() => this.openNav()}><i className="fas fa-bars" /></span>
        <nav id="mySidenav" className="sidenav">
          <a href="javascript:void(0)" className="closebtn" onClick={() => this.closeNav()}>&times;</a>
          <a onClick={this.alertManager}>Alert Manager</a>
          <a onClick={() => this.clockout()}>Clock Out</a>
        </nav>
        <span className="navBack" onClick={this.state.isManager ? () => this.props.history.push('/managerhome') : () => this.props.history.push('/salesScreen')}><i className="fas fa-home" /></span>
        {this.state.isManager &&
          <span
            onClick={() => this.notice()}
            style={(this.state.alerts.length > 0) ? {color: 'red'} : {color: 'white'}}
            className="navAlert">
            <div className="fas fa-exclamation"></div>
          </span>
        }
        <span className="navbar-time"><Moment interval={1000} format={"MM/DD/YYYY hh:mm:ss a"} /></span>
        <span className="navbar-employee">{this.state.employeeName}</span>
      </div>
    );
  }
}


export default withRouter(Navbar);
