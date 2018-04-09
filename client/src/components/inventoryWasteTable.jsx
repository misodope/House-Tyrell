import React from 'react';
import ReactTable from 'react-table';
// import "react-table/react-table.css";

class InventoryWasteTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.generateTableData(nextProps.wasteData);
  }

  generateTableData(data) {
    var wastedata = data.filter((order) => {
      return order.order_used === true
    }).map(order => {
      var obj = {};
      obj.order = order.order_name;
      obj.orderdate = order.order_date;
      obj.number = order.order_number;
      obj.waste = (100*(order.order_left)/order.order_initial).toFixed() + '%';
      obj.left = order.order_left;
      obj.initial = order.order_initial;
      return obj;
    })
    this.setState({
      tableData: wastedata,
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
      Header: '% Wasted',
      accessor: 'waste',
    }, {
      Header: 'Quantity Left (kg)',
      accessor: 'left',
    },
    {
      Header: 'Quantity Initial (kg)',
      accessor: 'initial',
    },
    ]
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

export default InventoryWasteTable;
