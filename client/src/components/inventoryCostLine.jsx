import React from 'react';

const c3 = require('c3/c3.js');

class InventoryCostLine extends React.Component {
  constructor(props) {
    super(props);

    this.updateChart = this.updateChart.bind(this);
  }
  componentWillMount() {
    this.props.getInventoryCostData();
    this.updateChart();
  }
  componentDidUpdate() {
    this.updateChart();
  }

  updateChart() {
    const chart = c3.generate({
      bindto: '#chart',
      x: 'x',
      data: {
        columns: [this.props.cost],
        type: 'line',
        colors: {
          Total_Inventory_Cost: '#5959e6',
        },
      },
      size: {
        height: 380,
      },
      axis: {
        x: {
          type: 'category',
          categories: this.props.date,
          tick: {
            rotate: 75,
            multiline: false,
          },
          height: 130,
        },
        y: {
          label: {
            text: 'Total Inventory Cost (dollars)',
            position: 'outer-middle',
          },
        },
      },
    });
  }

  render() {
    return <div id="chart"></div>
  }
}

export default InventoryCostLine;
