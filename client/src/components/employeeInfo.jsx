import React from 'react';
import Navigation from './managerNav.jsx';
import EmployeeBar from './employeeBar.jsx';
import Navbar from './navbar.jsx';
import moment from 'moment'
import Select from 'react-select';
import axios from 'axios';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import ConfirmationModal from './confirmationModal.jsx';
import socket from '../socket.js';
import { Upload, message, Button, Icon } from 'antd';

const columns =
[
  {
    Header: 'Date and Time',
    columns: [
      {
        Header: 'Clock In',
        accessor: 'clockIn',
      },
      {
        Header: 'Clock Out',
        accessor: 'clockOut',
      },
    ],
  },
  {
    Header: 'Total Worked',
    columns: [
      {
        Header: 'Minutes',
        accessor: 'minutes',
      },
    ],
  },
];

class EmployeeInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeSelectOptions: [],
      employeeName: '',
      employeeImage: 'http://www.sherwoodchamber.net/media/com_jbusinessdirectory/pictures/companies/0/profileicon-1487694034.png',
      employeeId: 'all',
      newEmployeeId: '',
      newEmployeeName: '',
      newEmployeeImage: '',
      managerLevel: false,
      timeSheet: [],
      allSales: null,
      employeeSalesRate: [],
      employeeSales: [],
      employeeSalesOption: 'monthly',
      trigger: 1,
    };
    this.getEmployeeList = this.getEmployeeList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.generateEmployeeId = this.generateEmployeeId.bind(this);
    this.submitEmployee = this.submitEmployee.bind(this);
    this.generateTimesheet = this.generateTimesheet.bind(this);
    this.getAllSales = this.getAllSales.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this);
    this.closeDelete = this.closeDelete.bind(this);
    this.openConfirmation = this.openConfirmation.bind(this);
    this.deletedEmployee = this.deletedEmployee.bind(this);
    this.sortDate = this.sortDate.bind(this);
    this.organizeSalesData = this.organizeSalesData.bind(this);
    this.getDateArray = this.getDateArray.bind(this);
    this.getRevenueArray = this.getRevenueArray.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  componentDidMount() {
    this.initSocket();
    this.getAllSales();
    this.getEmployeeList();
  }

  initSocket() {
    socket.on('madeSale', (sale) => {
      console.log('sale received:', sale)
      let allSales = this.state.allSales
      let date = sale.sale_date.split('T').join(' ')
      let tuple = [
        date.slice(0, date.length-6), sale.total
      ]
      console.log('all sales in socket func', allSales)
      allSales.all[0].push(tuple[0])
      allSales.all[1].push(tuple[1])
      allSales[sale.employee_id][0].push(tuple[0])
      allSales[sale.employee_id][1].push(tuple[1])

      this.setState({allSales})

      // let ordersPlaced = this.state.ordersPlaced;
      // ordersPlaced.push({ id: sale.id, sale_date: sale.sale_date, item_id: sale.item_id });
      // this.setState({
      //   ordersPlaced,
      // });
    });
  }

  getAllSales() {
    axios.get('/fetch/allsales')
      .then((sales) => {
        this.setState({
          allSales: sales.data.reduce((lib, sale) => {
            if(!lib.hasOwnProperty(sale.employee_id)) lib[sale.employee_id] = [[],['Sales']]
            let idx = lib[sale.employee_id]
              .indexOf(lib[sale.employee_id]
                .find(tuple => tuple[0] === sale.sale_date))

            // lib[sale.employee_id].push([sale.sale_date, sale.sale_amount])
            let date = sale.sale_date.split('T').join(' ')
            date = date.slice(0, date.length-6)
            lib[sale.employee_id][0].push(date)
            lib.all[0].push(date)
            lib[sale.employee_id][1].push(parseInt(sale.sale_amount))
            lib.all[1].push(parseInt(sale.sale_amount))

            // if(idx === -1) {
            //   lib[sale.employee_id].push([sale.sale_date, sale.sale_amount])
            // } else {
            //   lib[sale.employee_id][idx][1] += sale.sale_amount
            // }
            return lib
          }, {all: [[], ['Sales']]}),
          // employeeSales: this.state.allSales.all[1],
          // employeeSalesRate: this.state.allSales.all[0]
        })
        // this.setState({
        //   employeeSalesRate: this.state.allSales.all[0],
        //   employeeSales: this.state.allSales.all[1],
        // })
        this.organizeSalesData();
        console.log('sales obj', this.state.allSales);
      })
  }

  organizeSalesData() {
    // const data = this.state.salesData;
    console.log('organize sales data, data', this.state.allSales, 'employeeId:', this.state.employeeId)
    const data = this.state.allSales[this.state.employeeId]
    const objDay = {};
    const objMonth = {};
    const objYear = {};
    data[0].forEach((saleByDate, idx) => {
      const day = saleByDate.slice(0, 10);
      const month = saleByDate.slice(0, 7);
      const year = saleByDate.slice(0, 4);
      // const day = sale.sale_date.slice(0, 10);
      // const month = sale.sale_date.slice(0, 7);
      // const year = sale.sale_date.slice(0, 4);
      if (objDay[day] === undefined) {
        objDay[day] = Number(data[1][idx + 1]);
      }
      if (objMonth[month] === undefined) {
        objMonth[month] = Number(data[1][idx + 1]);
      }
      if (objYear[year] === undefined) {
        objYear[year] = Number(data[1][idx + 1]);
      }
      objDay[day] += Number(data[1][idx + 1]);
      objMonth[month] += Number(data[1][idx + 1]);
      objYear[year] += Number(data[1][idx + 1]);
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
    const orderedsalesYear = this.sortDate(salesYear).slice(0, 15);

    console.log('obj day and ordered', objDay, orderedsalesDay)

    if (this.state.employeeSalesOption === 'daily') {
      this.setState({
        employeeSalesRate: this.getDateArray(orderedsalesDay),
        employeeSales: this.getRevenueArray(orderedsalesDay),
      }, () => {
        this.updateChart();
      })
    }
    if (this.state.employeeSalesOption === 'monthly') {
      this.setState({
        employeeSalesRate: this.getDateArray(orderedsalesMonth),
        employeeSales: this.getRevenueArray(orderedsalesMonth),
      }, () => {
        this.updateChart();
      })
    }
    if (this.state.employeeSalesOption === 'yearly') {
      this.setState({
        employeeSalesRate: this.getDateArray(orderedsalesYear),
        employeeSales: this.getRevenueArray(orderedsalesYear),
      }, () => {
        this.updateChart();
      })
    }
  }

  updateChart() {
    this.setState({ trigger: this.state.trigger * -1})
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

  getEmployeeList() {
    axios.get('/fetch/allEmployees')
      .then((results) => {
        const myOptions = [];
        for (let i = 0; i < results.data.length; i += 1) {
          myOptions.push({ value: results.data[i], label: results.data[i].employee_name });
        }
        this.setState({
          employeeSelectOptions: ['all'].concat(myOptions),
        });
      })
      .catch((error) => {
        throw error;
      });
  }

  handleChange(value) {
    console.log('value on change:',value);
    this.setState({
      employeeName: value.value.employee_name,
      employeeImage: value.value.employee_img,
      employeeId: value.value.employee_id,
    }, () => {
      console.log('thisstate after first setstate', this.state)
      this.generateTimesheet()
      console.log("next emp id set:", this.state.employeeId);
      if(this.state.allSales.hasOwnProperty(this.state.employeeId)){
        this.setState({
          employeeSalesRate: this.state.allSales[this.state.employeeId][0],
          employeeSales: this.state.allSales[this.state.employeeId][1]
        })
      } else {
        this.setState({
          employeeSalesRate: '',
          employeeSales: '',
        })
      }
    });
  }

  handleNameInput(e) {
    this.setState({
      newEmployeeName: e.target.value,
    });
  }

  generateEmployeeId(e) {
    e.preventDefault();
    const num = Math.floor(Math.random() * 900000) + 100000;
    this.setState({
      newEmployeeId: num,
    });
  }

  generateTimesheet() {
    axios.get('/fetch/timeSheet', {
      params: {
        employeeId: this.state.employeeId,
      },
    })
      .then((results) => {
        this.setState({
          timeSheet: results.data,
        });
      })
      .catch((error) => {
        throw error;
      })
  }

  submitEmployee() {
    const formData = new FormData();
    formData.append('newEmployeeId', this.state.newEmployeeId);
    formData.append('newEmployeeName', this.state.newEmployeeName);
    formData.append('managerLevel', this.state.managerLevel);
    formData.append('newEmployeeImage', this.state.newEmployeeImage[0]);
    axios.post('/newEmployee', formData)
      .then(() => {
        this.setState({
          newEmployeeId: '',
          newEmployeeName: '',
          newEmployeeImage: '',
        });
      })
      .catch((error) => {
        throw error;
      });
  }

  openConfirmation(e,val) {
    e.preventDefault();
    document.getElementById(val).style.display = 'block';
  }

  closeDelete(modal) {
    document.getElementById(modal).style.display = 'none';
  }

  deletedEmployee() {
    this.getEmployeeList();
    this.getAllSales();
  }

  render() {
    let employeeImage, employeeDetails;
    if (this.state.employeeImage !== '') {
      employeeImage = <img src={this.state.employeeImage } />;
      employeeDetails =
      (<div className="profileGridDetails">
        <h2>Name: {this.state.employeeName}</h2>
        <h2>Employee Id: {this.state.employeeId}</h2>
        <h4>Hello</h4>
      </div>);
    }

    let tableData = [];
    if (this.state.timeSheet) {
      this.state.timeSheet.forEach((time) => {
        tableData.push({
          clockIn: time.check_in,
          clockOut: time.check_out,
          minutes: time.check_out !== null
            ?
            Math.floor((Math.floor(Date.parse(time.check_out) - Date.parse(time.check_in)) / 1000) / 60)
            :
            '',
        });
      });
    }
    return (
      <div>
        <div className="navbar">
          <Navbar />
        </div>
        <div className="managerScreenGrid">
          <ConfirmationModal
            closeDelete={this.closeDelete}
            employeeId={this.state.employeeId}
            employeeName={this.state.employeeName}
            deletedEmployee={this.deletedEmployee}
          />
          <div className="manager-navigation"><Navigation /></div>
          <div className="employeeGraphGrid">
            <div className="barChart">
              {this.state.employeeSales.length > 1 ?
                <EmployeeBar
                  amount={this.state.employeeSales}
                  intervals={this.state.employeeSalesRate}
                  update={this.state.trigger}
                />
                :
                <h1 className="noDataNotice">no data</h1>
              }
            </div>
            <div style={{ color: 'black' }}>
              <Select
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' }
                ]}
                placeholder="Select a graph"
                onChange={value =>
                  this.setState({ employeeSalesOption: value.value },
                    () => this.organizeSalesData())
                }
              />
            </div>
          </div>
          <div className="profileGrid">
            <div className="profileGridImage">
              {employeeImage}
            </div>
            {employeeDetails}
          </div>
          <div className="employeeSelect">
            <Select
              className="discountDropdown"
              options={this.state.employeeSelectOptions}
              matchProp="any"
              searchable="true"
              onChange={value => this.handleChange(value)}
              placeholder="Select an Employee"
            /> <br />
            <form>
              <label className="newEmployeeNameLabel">Add New Employee:</label>
              <Select
                options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
                autosize={false}
                placeholder="Manager Level"
                onChange={value => this.setState({ managerLevel: value.value })}
              />
              <br />
              <label className="newEmployeeNameLabel">Enter Employee Name: </label>
              <input style={{ border: '2px solid #5959e6', padding: '2%' }} type="text" onBlur={(e) => this.handleNameInput(e)} />
              <br />
              <div>
                <button onClick={e => this.generateEmployeeId(e)}>Generate Employee ID</button>
                <label className="employeeIdLabel">{this.state.newEmployeeId}</label>
              </div>
              <div>
                <label for="file-upload" class="custom-file-upload">
                  <i class="fas fa-upload"></i> Image Upload
                </label>
                <label style={{ marginLeft: '1%' }}>
                  {
                    this.state.newEmployeeImage ? this.state.newEmployeeImage[0].name : ''
                  }
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={e => this.setState({ newEmployeeImage: e.target.files })}
                  placeholder="Upload a photo"
                  accept='image/*'
                />
              </div>
              <div>
                <button onClick={(e) => this.submitEmployee(e)}>Submit</button>
                <button onClick={(e) => this.openConfirmation(e,'deleteEmployeeModal')}>Delete Employee</button>
              </div>
            </form>
          </div>
          <div>
            <ReactTable
              columns={columns}
              data={tableData}
              defaultPageSize={7}
              className="-striped -highlight"
              style={{ color: 'black' }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(EmployeeInfo);
