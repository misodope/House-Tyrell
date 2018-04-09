import React from 'react';

const c3 = require('c3/c3.js');

const sample = [
  ['x', '2017-04-01', '2017-05-01', '2017-06-01', '2017-07-01', '2017-08-01', '2017-09-01', '2017-10-01', '2017-11-01', '2017-12-01', '2018-01-01', '2018-02-01', '2018-03-01'],
  ['Revenue', 157, 165, 125, 112, 125, 112, 157, 165, 125, 112, 157, 165],
  ['Profit', 65, 93, 103, 79, 79, 65, 93, 103, 79, 65, 93, 103],
  ['Cost', 62, 46, 47, 64, 46, 47, 64, 62, 46, 47, 64, 62],
];

class SaleLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      salesData: [],
      ingredientsData: [],
      ordersData: [],
      dataType: '',
      dateArray: [],
      revenueArray: [],
      costArray:[],
    };
    this.organizeSalesData = this.organizeSalesData.bind(this);
    this.updateChart = this.updateChart.bind(this);
    this.sortDate = this.sortDate.bind(this);
    this.getDateArray = this.getDateArray.bind(this);
    this.getRevenueArray = this.getRevenueArray.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      salesData: nextProps.salesData,
      ingredientsData: nextProps.ingredientsData,
      ordersData: nextProps.ordersData,
      dataType: nextProps.dataType,
    }, () => {
      this.organizeSalesData();
      this.updateChart();
    });
  }
  componentDidUpdate() {
    // console.log('state', this.state.dateArray);
    this.updateChart();
  }
  organizeSalesData() {
    const data = this.state.salesData;
    const objDay = {};
    const objMonth = {};
    const objYear = {};
    data.forEach((sale) => {
      const day = sale.sale_date.slice(0, 10);
      const month = sale.sale_date.slice(0, 7);
      const year = sale.sale_date.slice(0, 4);
      if (objDay[day] === undefined) {
        objDay[day] = Number(sale.sale_amount);
      }
      if (objMonth[month] === undefined) {
        objMonth[month] = Number(sale.sale_amount);
      }
      if (objYear[year] === undefined) {
        objYear[year] = Number(sale.sale_amount);
      }
      objDay[day] += Number(sale.sale_amount);
      objMonth[month] += Number(sale.sale_amount);
      objYear[year] += Number(sale.sale_amount);
    });
    const salesDay = Object.keys(objDay).map((date) => {
      return [date, objDay[date]];
    });
    const salesMonth = Object.keys(objMonth).map((date) => {
      return [date, objMonth[date]];
    });
    const salesYear = Object.keys(objYear).map((date) => {
      return [date, objYear[date]];
    });
    const orderedsalesDay = this.sortDate(salesDay).slice(0, 15);
    const orderedsalesMonth = this.sortDate(salesMonth).slice(0, 12);
    const orderedsalesYear = this.sortDate(salesYear);

    if (this.state.dataType === 'daily') {
      this.setState({
        dateArray: this.getDateArray(orderedsalesDay),
        revenueArray: this.getRevenueArray(orderedsalesDay),
      }, () => {
        this.updateChart();
      })
    }
    if (this.state.dataType === 'monthly') {
      this.setState({
        dateArray: this.getDateArray(orderedsalesMonth),
        revenueArray: this.getRevenueArray(orderedsalesMonth),
      }, () => {
        this.updateChart();
      })
    }
    if (this.state.dataType === 'yearly') {
      this.setState({
        dateArray: this.getDateArray(orderedsalesYear),
        revenueArray: this.getRevenueArray(orderedsalesYear),
      }, () => {
        this.updateChart();
      })
    }
  }
  sortDate(array) {
    return array.sort((a, b) => {
      if ((a[0]) < (b[0])) {
        return 1;
      }
      if ((a[0]) > (b[0])) {
        return -1;
      }
      return 0;
    })
  }
  getDateArray(array) {
    const date = array.map((entry) => {
      return entry[0]
    })
    const reversed = date.reverse();
    return reversed;
  }
  getRevenueArray(array) {
    const revenue = array.map((entry) => {
      return entry[1]
    })
    const reversed = revenue.reverse();
    reversed.unshift('Revenue');  
    return reversed;
  }
  updateChart() {
    // console.log(this.state.dataType, this.state.dateArray);
    // console.log(this.state.dataType, this.state.revenueArray);
    const chart = c3.generate({
      bindto: '#chart',
      x: 'x',
      data: {
        columns: [this.state.revenueArray],
        type: 'line',
        colors: {
          Revenue: '#e65959',
          // Profit: '#5959e6',
          // Cost: '#45d645',
        },
      },
      axis: {
        x: {
          type: 'category',
          categories: this.state.dateArray,
          tick: {
            rotate: 90,
            multiline: false,
          },
          height: 130,
        },
        y: {
          label: {
            text: '$ (Thousands)',
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

export default SaleLine;
