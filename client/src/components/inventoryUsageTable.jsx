import React from 'react';
import ReactTable from 'react-table';
// import "react-table/react-table.css";

class InventoryUsageTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
    this.generateTableData = this.generateTableData.bind(this);
  }

  // componentWillMount() {
  //   this.generateTableData();
  // }
  componentWillReceiveProps(nextProps) {
    this.generateTableData(nextProps.usageData1, nextProps.usageData2);
  }

  // componentWillUpdate() {
  //   this.generateTableData(this.props.usageData1, this.props.usageData2);
  // }

  generateTableData(data1, data2) {
    var data_1 = data1.filter((order) => {
      return order.order_used === false;
    }).map(order => {
      var obj = {};
      obj.order = order.order_name;
      obj.orderdate = order.order_date;
      obj.number = order.order_number;
      obj.usage = (100*(order.order_initial - order.order_left)/order.order_initial).toFixed() + '%';
      obj.left = order.order_left;
      obj.initial = order.order_initial;
      obj.expiredate = order.order_expire;
      return obj;
    })

    var data_2 = data2.map((order) => {
      var obj = {};
      obj.order = order.ingredient_name;
      obj.orderdate = order.order_date;
      obj.number = order.order_number;
      obj.usage = (100*(order.ingredient_initial - order.ingredient_left)/order.ingredient_initial).toFixed() + '%';
      obj.left = order.ingredient_left;
      obj.initial = order.ingredient_initial;
      obj.expiredate = order.ingredient_expire;
      return obj;
    })
    this.setState({
      tableData: data_1.concat(data_2),
    });
  }

  render() {
    var columns = [{
      Header: 'Order Date',
      accessor: 'orderdate',
    },
    {
      Header: 'Order Number',
      accessor: 'number',
    },{
      Header: 'Order Item',
      accessor: 'order',
    },
    {
      Header: '% Usage',
      accessor: 'usage',
    }, {
      Header: 'Quantity Left (kg)',
      accessor: 'left',
    },
    {
      Header: 'Quantity Initial (kg)',
      accessor: 'initial',
    },
    {
      Header: 'Expiration Date',
      accessor: 'expiredate',
    },
    ]
    return (
      <div>
        <ReactTable
        data={this.state.tableData}
        columns={columns}
        defaultPageSize={10}
        style={{color: 'black'}}
        sorted={[{
          id: 'orderdate',
          desc: true,
        }]}
        />
      </div>
    )
  }
}

export default InventoryUsageTable;
