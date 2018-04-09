import React from 'react';
import { withRouter } from 'react-router';
import Navigation from './managerNav.jsx';
import InventoryUsagePie from './inventoryUsagePie.jsx';
import InventoryCostLine from './inventoryCostLine.jsx';
import InventoryWastePie from './inventoryWastePie.jsx';
import Select from 'react-select';
import Navbar from './navbar.jsx';
import axios from 'axios';
import InventoryUsageTable from './inventoryUsageTable.jsx';
import InventoryCostTable from './inventoryCostTable.jsx';
import InventoryWasteTable from './inventoryWasteTable.jsx';

class InventoryInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewType: 'usage',
      usageData1: {},
      usageData2: {},
      costData1: {},
      costData2: {},
      wasteData: {},
      initial: '',
      left: '',
      date: [],
      cost: [],
      winitial: '',
      wleft: '',
      ingredientName: '',
      orderNumber: '',
      orderDate: '',
      expireDate: '',
      orderQuantity: '',
      unitCost: '',
      totalCost: '',
      showAddInventory: true,
      ingredientDropDown: [],
      ingredientToRemove: '',
      alertItems: '',
    };
    this.getInventory1 = this.getInventory1.bind(this);
    this.getInventory2 = this.getInventory2.bind(this);
    this.getInventoryData = this.getInventoryData.bind(this);
    this.calculateInventory1 = this.calculateInventory1.bind(this);
    this.calculateInventory2 = this.calculateInventory2.bind(this);
    this.hasExpired = this.hasExpired.bind(this);
    this.getCost1 = this.getCost1.bind(this);
    this.getCost2 = this.getCost2.bind(this);
    this.getInventoryCostData = this.getInventoryCostData.bind(this);
    this.calculateCostByRecentMonth = this.calculateCostByRecentMonth.bind(this);
    this.getWaste = this.getWaste.bind(this);
    this.calculateWaste = this.calculateWaste.bind(this);
    this.transformDate = this.transformDate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.showAddInventory = this.showAddInventory.bind(this);
    this.showRemoveInventory = this.showRemoveInventory.bind(this);
    this.prepareIngredientsDropDown = this.prepareIngredientsDropDown.bind(this);
    this.handleRemoveIngredient = this.handleRemoveIngredient.bind(this);
    this.getIngredientID = this.getIngredientID.bind(this);
    this.containIngredient = this.containIngredient.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  /* Inventory Usage Functions */
  getInventory1() {
    return axios.get('/fetch/currentInventory');
  }
  getInventory2() {
    return axios.get('/fetch/inventory');
  }
  getInventoryData() {
    axios.all([this.getInventory1(), this.getInventory2()])
      .then(axios.spread((data1, data2) => {
        const result1 = this.calculateInventory1(data1.data);
        const result2 = this.calculateInventory2(data2.data);
        this.setState({
          usageData1: data1.data,
          usageData2: data2.data,
          initial: result1[0] + result2[0],
          left: result1[1] + result2[1],
          ingredientDropDown: this.prepareIngredientsDropDown(data2.data),
        }, () => {
          console.log('Ingredients Data', data2.data);
          console.log('ingredients data', this.state.ingredientDropDown);
        });
    }));
  }
  calculateInventory1(data) {
    var initial = 0;
    var left = 0;
    data.forEach((item) => {
      if (!item.order_used) {
        initial += Number(item.order_initial);
        left += Number(item.order_left);
      }
    })
    return [initial, left];
  }
  calculateInventory2(data) {
    var initial = 0;
    var left = 0;
    data.forEach((item) => {
      initial += Number(item.ingredient_initial);
      left += Number(item.ingredient_left);
    })
    return [initial, left];
  }
  hasExpired(date) {
    const mm = Number(date.slice(5, 7));
    const dd = Number(date.slice(-2));
    const yyyy = Number(date.slice(0, 4));
    const today = new Date(Date.now()).toLocaleString();
    const month = Number(today.slice(0, 1));
    const day = Number(today.slice(2, 4));
    const year = Number(today.slice(-4));

    if (year > yyyy) {
      return true;
    }
    if (year === yyyy && month > mm) {
      return true;
    }
    if (year === yyyy && month === mm && date > dd) {
      return true;
    } else {
      return false;
    }

  }

  /* Inventory Cost Functions */
  getCost1() {
    return axios.get('/fetch/ordercost')
  }
  getCost2() {
    return axios.get('/fetch/inventorycost')
  }
  getInventoryCostData() {
    axios.all([this.getCost1(), this.getCost2()])
    .then(axios.spread((data1, data2) => {
      var cost = this.calculateCostByRecentMonth(data1, data2).slice(0, 6);
      var dateArray = cost.map(item => item[0]);
      var costArray = cost.map(item => item[1]);
      costArray.push('Total_Inventory_Cost');

      this.setState({
        costData1: data1.data,
        costData2: data2.data,
        date: dateArray.reverse(),
        cost: costArray.reverse(),
      }, () => {
        console.log('date for line', this.state.date);
        console.log('cost for line', this.state.cost);
      });
  }));
  }
  calculateCostByRecentMonth(data1, data2) {
    var cost = {};
    data1.data.forEach((order) => {
      var date = order.order_date.slice(0, 7);
      if (cost[date] === undefined) {
        cost[date] = Number(order.order_total);
      } else {
        cost[date] += Number(order.order_total);
      }
    })
    data2.data.forEach((order) => {
        var date = order.order_date.slice(0, 7);
        if (cost[date] === undefined) {
          cost[date] = Number(order.ingredient_total);
        } else {
          cost[date] += Number(order.ingredient_total);
        }
      })
    var costArray = Object.keys(cost).map(function(key) {
      return [key, cost[key]];
    });
    var convertDate = (dateString) => {
      return new Date(dateString.slice(0, 4), dateString.slice(-2));
    }
    return costArray.sort((a, b) => {
      if (convertDate(a[0]) < convertDate(b[0])) {
        return 1;
      } else if (convertDate(a[0]) > convertDate(b[0])) {
        return -1;
      } else {
        return 0;
      }
    })
  }

  /* Inventory Waste Functions */
  getWaste() {
    axios.get('/fetch/waste')
      .then(data => {
          // console.log('waste data', data.data);
          var result = this.calculateWaste(data.data);
          this.setState({
            wasteData: data.data,
            winitial: result[0],
            wleft: result[1]
          })
      })
  }
  calculateWaste(data) {
    var winitial = 0;
    var wleft = 0;
    data.forEach((item) => {
      if (item.order_used) {
        winitial += Number(item.order_initial);
        wleft += Number(item.order_left);
      }
    })
    return [winitial, wleft];
  }

  /* Add Inventory */ 
  showAddInventory() {
    this.setState({
      showAddInventory: true,
    });
  }

  transformDate(date) {
    return date.slice(0, 4) + '/' + date.slice(5, 7) + '/' + date.slice(-2);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  handleClick(event) {
    event.preventDefault();
    axios.post('/addIngredient', {
      ingredientName: this.state.ingredientName,
      orderNumber: this.state.orderNumber,
      orderDate: this.transformDate(this.state.orderDate),
      expireDate: this.transformDate(this.state.expireDate),
      orderQuantity: this.state.orderQuantity,
      unitCost: this.state.unitCost,
      totalCost: this.state.totalCost,
    })
      .then(this.setState({
        ingredientName: '',
        orderNumber: '',
        orderDate: '',
        expireDate: '',
        orderQuantity: '',
        unitCost: '',
        totalCost: '',
      }), () => {
        this.getInventoryData();
      });
  }

  /* Remove Inventory */

  showRemoveInventory() {
    this.setState({
      showAddInventory: false,
    });
  }

  prepareIngredientsDropDown(data) {
    const ingredients = data.map((item) => {
      const obj = {};
      obj.value = item.ingredient_name.toLowerCase();
      obj.label = item.ingredient_name;
      return obj;
    });
    return ingredients;
  }

  handleRemoveIngredient(event) {
    event.preventDefault();
    const item = this.state.ingredientToRemove.label;
    axios.get('/fetch/items')
      .then((menuItems) => {
        var menuitems = [];
        menuItems.data.map((menuItem) => {
          if (this.containIngredient(menuItem, this.getIngredientID(item))) {
            menuitems.push(menuItem.item_name);
          }
        });
        this.setState({
          alertItems: menuitems.join(', '),
        });
        const isinMenu = menuItems.data.some((menuItem) => {
          return this.containIngredient(menuItem, this.getIngredientID(item));
        });
        if (isinMenu) {
          this.openModal('alertRemovalModal');
        } else {
          axios.post('/removeIngredient', {
            ingredient: item,
          })
            .then(this.setState({
              ingredientToRemove: '',
            }));
        }
      });
  }

  getIngredientID(target) {
    var ingredients = this.state.usageData2;
    for (var i = 0; i < ingredients.length; i++) {
      if (ingredients[i].ingredient_name === target) {
        return ingredients[i].id;
      }
    }
  }

  containIngredient(menuItem, targetIngID) {
    var ingredients = JSON.parse(menuItem.item_ingredients);
    return ingredients.some((ing) => {
      return ing.ingredient_id === targetIngID
    })
  }

  openModal(modal) {
    document.getElementById(modal).style.display = 'block';
  }

  closeModal(modal) {
    document.getElementById(modal).style.display = 'none';
  }

  render() {
    const type = this.state.viewType;
    const showAdd = this.state.showAddInventory;
    return (
      <div>
        <div className="navbar">
          <Navbar />
        </div>
        <div className="managerScreenGrid-graph">
          <div className="manager-navigation"><Navigation /></div>
          <div className="graphGrid-inventory">
            {type === 'usage' ? (
            <div className="graph"><InventoryUsagePie
            initial={ this.state.initial } left={ this.state.left } getInventoryData={ this.getInventoryData }/></div>) : (
              type === 'cost' ? (
              <div className="graph"><InventoryCostLine
              date={ this.state.date } cost={ this.state.cost } getInventoryCostData={ this.getInventoryCostData }/></div>) : (
              <div className="graph"><InventoryWastePie
              winitial={ this.state.winitial } wleft={ this.state.wleft } getWaste = { this.getWaste }/></div>)
            )}
          </div>
          
          <div className="inventory-graph-options" style={{ color: 'black' }}>
            <div>
              <Select
                options={[{ value: 'usage', label: 'Usage' }, { value: 'cost', label: 'Cost' }, { value: 'waste', label: 'Waste' }]}
                placeholder="Select a graph"
                onChange={value => this.setState({ viewType: value.value })}
              />
            </div>
            <div><button onClick={this.showAddInventory} style={{ backgroundColor: '#5959e6', paddingLeft: '11%', paddingRight: '11%' }}>Add An Ingredient</button></div>
            <div><button onClick={this.showRemoveInventory} style={{ backgroundColor: '#e65959', paddingLeft: '6%', paddingRight: '6%' }}>Remove An Ingredient</button></div>
          </div>

          { (showAdd === true) ? (
          <div className="addInventoryForm">
            <div>Order Number</div>
            <div>Ingredient Name</div>
            <div>Order Quantity</div>
            <div>Unit Cost</div>
            <div>Total Cost</div>
            <div>Order Date</div>
            <div>Expiration Date</div>
            <input name="orderNumber" type="text" value={this.state.orderNumber} onChange={this.handleInputChange} />
            <input name="ingredientName" type="text" value={this.state.ingredientName} onChange={this.handleInputChange} />
            <input name="orderQuantity" type="number" value={this.state.orderQuantity} onChange={this.handleInputChange} />
            <input name="unitCost" type="number" value={this.state.unitCost} onChange={this.handleInputChange} />
            <input name="totalCost" type="number" value={this.state.totalCost} onChange={this.handleInputChange} />
            <input name="orderDate" type="date" value={this.state.orderDate} onChange={this.handleInputChange} />
            <input name="expireDate" type="date" value={this.state.expireDate} onChange={this.handleInputChange} />
            <span onClick={this.handleClick}><i class="fas fa-plus-circle" /></span>
          </div>
          ) : ( 
            <div className="removeInventoryForm">
              <div className="removeInventoryForm-dropdown">
                <Select
                  options={this.state.ingredientDropDown}
                  placeholder="Select an ingredient"
                  value={this.state.ingredientToRemove}
                  onChange={value => this.setState({ ingredientToRemove: value })}
                />
              </div>
              <span onClick={this.handleRemoveIngredient}><i class="fas fa-minus-circle" /></span>
            </div>) 
          }
          <div id="alertRemovalModal" className="alertRemovalModal animated fadeIn">
            <div className="alert-removal-modal-header">
            <div className="alert-removal-close" onClick={() => this.closeModal('alertRemovalModal')}>&times;</div>
            </div>
            <div className="alert-removal-modal-body">This ingredient cannot be removed. It is currently used in {this.state.alertItems}. You may change your menu items first.</div>
            <div className="alert-removal-modal-footer">
              <button onClick={() => this.props.history.push("/managercustomize")} style={{ color: '#5959e6' }}>Change Menu Items</button>
              <button onClick={() => this.closeModal('alertRemovalModal')} style={{ color: '#e65959' }}>Cancel</button>
            </div>
          </div>

          <div className="graphTable">
            {type === 'usage' ? (      
              <InventoryUsageTable
              usageData1={ this.state.usageData1 } usageData2={ this.state.usageData2 }/>) : (
                type === 'cost' ? (
                  <InventoryCostTable
                  costData1={ this.state.costData1 } costData2={ this.state.costData2 }/>
                ) : (
                  <InventoryWasteTable wasteData={ this.state.wasteData }/>
                )
              ) 
            }
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(InventoryInfo);
