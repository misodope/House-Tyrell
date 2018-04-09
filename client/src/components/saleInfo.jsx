import React from 'react';
import axios from 'axios';
import Navigation from './managerNav.jsx';
import SaleLine from './saleLine.jsx';
import SaleTable from './saleTable.jsx';
import Navbar from './navbar.jsx';
import Select from 'react-select';

class SaleInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      salesData: [],
      itemsData: [],
      ingredientsData: [],
      ordersData: [],
      dataType: 'daily',
    };
    this.getItemsData = this.getItemsData.bind(this);
    this.getSalesData = this.getSalesData.bind(this);
    this.getData = this.getData.bind(this);
    this.getIngredientData = this.getIngredientData.bind(this);
    this.getOrderData = this.getOrderData.bind(this);
  }

  componentWillMount() {
    this.getData();
  }

  getSalesData() {
    return axios.get('/fetch/allsales')
  }

  getItemsData() {
    return axios.get('/fetch/allitems')
  }

  getIngredientData() {
    return axios.get('/fetch/ingredients')
  }

  getOrderData() {
    return axios.get('/fetch/currentInventory')
  }

  getData() {
    axios.all([this.getSalesData(), this.getItemsData(), this.getIngredientData(), this.getOrderData()])
      .then(axios.spread((salesdata, itemsdata, ingredientsdata, ordersdata) => {
        this.setState({
          salesData: salesdata.data,
          itemsData: itemsdata.data,
          ingredientsData: ingredientsdata.data,
          ordersData: ordersdata.data,
        });
      }));
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="managerScreenGrid-sales">
          <div className="manager-navigation"><Navigation /></div>
          <div className="graph-sales" style={{ gridColumn: '2 / 5', gridRow: '1 / 1', paddingTop: '5%' }}>
            <SaleLine
              salesData={this.state.salesData}
              ingredientsData={this.state.ingredientsData}
              ordersData={this.state.ordersData}
              dataType={this.state.dataType}
            />
          </div>
          <div className="selectGraphDropDown-sales" style={{ color: 'black', padding: '5%' }}>
            <Select
              options={[{ value: 'daily', label: 'Daily' }, { value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]}
              placeholder="Select a graph"
              onChange={value => this.setState({ dataType: value.value })}
            />
          </div>
          <div className="graphTable" style={{ paddingTop: '2%' }}>
            <SaleTable salesData={this.state.salesData} itemsData={this.state.itemsData} />
          </div>
        </div>
      </div>

    );
  }
}

export default SaleInfo;
