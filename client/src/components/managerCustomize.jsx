import React from 'react';
import axios from 'axios';
import Navbar from './navbar.jsx';
import Navigation from './managerNav.jsx';
import App from '../../managerSrc/components/app.jsx'


export default class ManagerCustomize extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'dummy': 'dummy'
    }

  }

  render() {
    return (
      <div>
        <div>
          <Navbar />
        </div>
        <div className="managerScreenGrid">
          <div className="manager-navigation"><Navigation /></div>
          <div style={{ gridColumn: '2 / 4' }}>
            <App />
          </div>
        </div>
      </div>
    )
  }
}
