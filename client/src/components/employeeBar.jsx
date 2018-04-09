import React from 'react';

const c3 = require('c3/c3.js');

const columns = [
  ['Sales', 3760, 2021, 7093, 6221, 4052, 2308],
];

class EmployeeBar extends React.Component {
  constructor(props) {
    super(props);
    this.updateChart = this.updateChart.bind(this);
  }
  componentDidMount() {
    this.updateChart();
  }
  componentDidUpdate() {
  // componentDidReceiveProps() {
    this.updateChart();
  }
  componentDidReceiveProps() {
    this.updateChart();
  }
  updateChart() {
    const chart = c3.generate({
      bindto: '#chart',
      x: 'x',
      data: {
        columns: [this.props.amount],
        // columns: columns, // data
        // type: 'bar',
        colors: {
          Sales: '#5959e6',
        },
      },
      axis: {
        x: {
          type: 'category',
          categories: this.props.intervals,
          // categories: ['Brad', 'Christine', 'Harriette', 'Peter', 'Phil', 'Tam'],
          tick: {
            rotate: 75,
            multiline: false,
          },
          height: 130,
        },
        y: {
          label: {
            text: 'Total Sales (dollars)',
            position: 'outer-middle',
          },
        },
      },
    });
  }

  render() {
    return <div id="chart">lol</div>;
  }
}

export default EmployeeBar;
