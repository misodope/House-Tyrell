import React from 'react';
import axios from 'axios';

const c3 = require('c3/c3.js');

class InventoryUsagePie extends React.Component {
  constructor(props) {
    super(props);

    this.updateChart = this.updateChart.bind(this);
  }
  componentWillMount() {
    this.props.getInventoryData();
    this.updateChart();
  }
  componentDidUpdate() {
    this.updateChart();
  }

  updateChart() {
    const chart = c3.generate({
      bindto: '#chart',
      x: 'x',
      size: {
        height: 380,
      },
      data: {
        columns: [
          ['Inventory_Left', this.props.left], ['Inventory_Used', this.props.initial - this.props.left],
        ],
        type: 'pie',
        colors: {
          Inventory_Left: '#e65959',
          Inventory_Used: '#5959e6',
        },
      },
      // tooltip: {
      //   show: false,
      // },
      axis: {
        x: {
          type: 'category',
          categories: ['Overall Inventory'],
          tick: {
            multiline: false,
          },
        },
        y: {
          label: {
            text: 'Quantity (lbs.)',
            position: 'outer-middle',
          },
        },
      },
    });
  }

  render() {
    return <div id="chart"></div>;
  }
}

export default InventoryUsagePie;
