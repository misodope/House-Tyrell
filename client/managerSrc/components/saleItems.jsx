import React from 'react';

export default class SaleItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'dummy': 'dummy'
    }
  }

  render() {
    return(
      <div className="saleItemGridManager">
        <div onClick={() => this.props.openModal('itemModal')}>
          <h3>Add an Item</h3>
        </div>
        {
          this.props.menuItems.map((item, i) => {
            if (item.item_image === undefined || item.item_image === null) {
              return (
                <div key={i} className={`item_${i}`}>
                  <div onClick={() => this.props.removeItem(item)} className="removeItem"><i style={{color: '#333'}} className="fas fa-times-circle"></i></div>
                  <h3>{item.item_name}</h3>
                </div>);
            }
              return (
                <div key={i} className={`item_${i}`}>
                  <div onClick={() => this.props.removeItem(item)} className="removeItem"><i style={{color: '#333'}} className="fas fa-times-circle"></i></div>
                  {(((typeof item.item_image) === 'object') || (item.item_image === ''))?
                  <h3>{item.item_name}</h3>
                  :
                  <img alt={item.item_name} src={item.item_image} style={{ width: '95%', height: '78%' }} />
                  }
                </div>);
          })
        }
      </div>
    )
  }
}



// const SaleItems = ({ menuItems, itemClick }) => (
//   <div>
//     <h3>Add an Item</h3>
//   </div>
// );
//
// export default SaleItems;
