import React from 'react';
import { withRouter } from 'react-router';
import moment from 'moment';
import axios from 'axios';

export default class SaleControl extends React.Component {
  constructor(props) {
    super(props);
  };


  render() {
    return (
      <div className="innerSaleGrid">
        <button type="button">Cash</button>
        <button type="button">Credit</button>
        <button type="button">Discount</button>
        <button type="button">Void</button>
      </div>
    );
  }
}
