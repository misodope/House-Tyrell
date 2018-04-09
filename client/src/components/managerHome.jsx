import React from 'react';
import axios from 'axios';
import moment from 'moment';
import ReactTable from 'react-table';
import Select from 'react-select';
import Navigation from './managerNav.jsx';
import Navbar from './navbar.jsx';
import ManagerHomeBar from './managerHomeBar.jsx';
import socket from '../socket.js';


const columns =
[
  {
    Header: 'Currently Clocked In',
    columns: [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Clock In',
        accessor: 'clockIn',
      },
    ],
  },
];
class ManagerHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allEmployees: [],
      allSales: [],
      totalSales: 0,
      allIngredients: [],
      tableData: [],
      dropdownOptions: [],
      lowStockPercent: 20,
      totalCash: 0,
      loading: true,
    };
    this.getAllClockedIn = this.getAllClockedIn.bind(this);
    this.getAllSalesToday = this.getAllSalesToday.bind(this);
    this.getLowInventory = this.getLowInventory.bind(this);
    this.percentageDropdownOptions = this.percentageDropdownOptions.bind(this);
    this.initSocket = this.initSocket.bind(this);
  }

  componentDidMount() {
    this.initSocket();
    // this.getAllClockedIn();
    this.getAllSalesToday();
    this.getLowInventory();
    this.percentageDropdownOptions();
  }

  initSocket() {
    socket.on('madeSale', (sale) => {
      console.log("THIS IS SOCKET MANAGER", sale);
      let allSales = this.state.allSales;
      allSales.push({ sale });
      this.setState({
        totalSales: (parseFloat(this.state.totalSales) + parseFloat(sale.total)).toFixed(2),
        totalCash: sale.type ? (parseFloat(this.state.totalCash) + parseFloat(sale.total)).toFixed(2) : this.state.totalCash,
        allSales,
      });
    });
    socket.on('employeeLogin', (data) => {
      this.getAllClockedIn();
      let temp = this.state.allEmployees.slice();
      temp.push(data)
      let tableTemp = this.state.tableData.slice();
      tableTemp.push({
        name: data.employee_name,
        clockIn: data.check_in
      })
      this.setState({
        allEmployees: temp,
        tableData: tableTemp,
      })
    })
    socket.on('employeeLogout', (employee) => {
      let temp = this.state.allEmployees.slice();
      let tempTable = this.state.tableData.slice();
      for (let i = 0; i < temp.length; i += 1) {
        if (temp[i].employee_name === employee.employee_name) {
          temp.splice(i, 1);
          tempTable.splice(i, 1);
        }
      }
      this.setState({ allEmployees: temp, tableData: tempTable });
    })
  }

  getAllClockedIn() {
    axios.get('/fetch/allEmployees/clockedIn')
      .then((results) => {
        this.setState({
          allEmployees: results.data[0],
        });
      })
      .then(() => {
        const tableData = [];
        this.state.allEmployees.forEach((employee) => {
          tableData.push({
            name: employee.employee_name,
            clockIn: employee.check_in,
          });
        });
        this.setState({
          tableData,
        });
      })
      .catch((error) => {
        throw error;
      });
  }

  getAllSalesToday() {
    axios.get('/fetch/allSales/today')
      .then((results) => {
        let todaySales = [];
        results.data.forEach((result) => {
          let saleDate = moment(result.sale_date).format('MM DD YYYY');
          let todayDate = moment().format('MM DD YYYY');
          if (saleDate === todayDate) {
            todaySales.push(result);
          }
        });
        let totalAmount = 0;
        todaySales.forEach((sale) => {
          totalAmount += parseFloat(sale.sale_amount);
        })
        let totalCash = 0;
        todaySales.forEach((sale) => {
          if (sale.sale_cash === true) {
            totalCash += parseFloat(sale.sale_amount);
          }
        })
        this.setState({
          allSales: todaySales,
          totalSales: totalAmount.toFixed(2),
          totalCash: totalCash.toFixed(2),
          loading: false,
        });
      })
      .catch((error) => {
        throw error;
      });
  }

  getLowInventory() {
    axios.get('/fetch/inventory')
      .then((results) => {
        this.setState({
          allIngredients: results.data,
        });
      })
      .catch((error) => {
        throw error;
      });
  }

  percentageDropdownOptions() {
    const dropdownOptions = [];
    for (let i = 5; i <= 100; i += 5) {
      dropdownOptions.push({ value: i, label: `${i}% in Stock` });
    }
    this.setState({
      dropdownOptions,
    });
  }

  render() {
    const lowIngredients = [];
    this.state.allIngredients.forEach((ingredient) => {
      if ((parseFloat(ingredient.ingredient_left).toFixed(2) / parseFloat(ingredient.ingredient_initial).toFixed(2) * 100) <= this.state.lowStockPercent) {
        lowIngredients.push(ingredient);
      }
    });

    let content;
    if (this.state.loading) {
      content = <div className="loading"><img src="https://s3.amazonaws.com/tyrell-pos/octopus-loading.gif" /></div>
    } else {
      content =
      (
        <div>
          <div>
            <Navbar />
          </div>
          <div className="managerScreenGrid-home">
            <div className="manager-navigation"><Navigation /></div>
            <div id="card" className="managerCard-1">
              <h1>{this.state.allEmployees.length}</h1>
              <h2>Clocked In</h2>
            </div>
            <div id="card" className="managerCard-2">
              <h1>{this.state.allSales.length}</h1>
              <h2>Total Transactions</h2>
            </div>
            <div id="card" className="managerCard-3">
              <h1><i className="fas fa-dollar-sign" /> {this.state.totalSales}</h1>
              <h2>Total Sales</h2>
            </div>
            <div id="card" className="managerCard-5">
              <h1><i className="fas fa-dollar-sign" /> {this.state.totalCash}</h1>
              <h2>Total Cash</h2>
            </div>
            <div id="card" className="managerCard-4">
              {
                lowIngredients.length > 0
                ?
                lowIngredients.map(ingredient =>
                  (<h4><i className='fas fa-exclamation-circle' /> {ingredient.ingredient_name} </h4>))
                :
                (<h2 style={{ gridRow: '3', gridColumn: '1 / 6' }}><i className='fas fa-thumbs-up' /> No Low Ingredients</h2>)
              }
              <div style={{ gridRow: '1', gridColumn: '1 / 6', color: 'black' }}>
                <Select
                  placeholder='Choose a Low Stock Percentage, default is set to 20%'
                  options={this.state.dropdownOptions}
                  matchProp="any"
                  searchable="false"
                  onChange={value => this.setState({ lowStockPercent: value.value })}
                />
              </div>
            </div>
            <div className="managerClockTable">
              <ReactTable
                columns={columns}
                data={this.state.tableData}
                defaultPageSize={5}
                className="-striped -highlight"
                style={{ color: 'black' }}
              />
            </div>
            <div style={{ gridColumn: '3 / 9', gridRow: '2 / 3', padding: '3% 0' }}>
              <ManagerHomeBar />
            </div>
          </div>
        </div>
      )
    }
    return (
      <div>
        {content}
      </div>
    );
  }
}

export default ManagerHome;
