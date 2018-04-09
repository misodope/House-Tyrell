import React from 'react';
import ReactTable from 'react-table';
// import "react-table/react-table.css";

class InventoryCostTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
    this.generateTableData = this.generateTableData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.generateTableData(nextProps.costData1, nextProps.costData2);
  }
  generateTableData(data1, data2) {
    const data_1 = data1.map((order) => {
      const obj = {};
      obj.orderdate = order.order_date;
      obj.number = order.order_number;
      obj.order = order.order_name;
      obj.cost = order.unit_cost;
      obj.quantity = order.order_initial;
      obj.totalcost = order.order_total;
      return obj;
    });
    const data_2 = data2.map((order) => {
      const obj = {};
      obj.orderdate = order.order_date;
      obj.number = order.order_number;
      obj.order = order.ingredient_name;
      obj.cost = order.unit_cost;
      obj.quantity = order.ingredient_initial;
      obj.totalcost = order.ingredient_total;
      return obj;
    });
    this.setState({
      tableData: data_1.concat(data_2),
    });
  }

  render() {
    const columns = [{
      Header: 'Order Date',
      accessor: 'orderdate',
    },
    {
      Header: 'Order Number',
      accessor: 'number',
    },
    {
      Header: 'Order Item',
      accessor: 'order',
    },
    {
      Header: 'Unit Cost ($)',
      accessor: 'cost',
    },
    {
      Header: 'Quantity (kg)',
      accessor: 'quantity',
    },
    {
      Header: 'Total Cost ($)',
      accessor: 'totalcost',
    },
    ];
    return (
      <div>
        <ReactTable
          data={this.state.tableData}
          columns={columns}
          defaultPageSize={10}
          style={{ color: 'black' }}
          sorted={[{
            id: 'orderdate',
            desc: true,
          }]}
        />
      </div>
    );
  }
}

export default InventoryCostTable;
