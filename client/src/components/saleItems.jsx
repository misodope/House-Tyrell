import React from 'react';

const SaleItems = ({ menuItems, itemClick }) => (
  <div className="saleItemGrid">
    {
      menuItems.map((item, i) => {
        if (item.item_image === undefined || item.item_image === null) {
          return (
            <div key={i} className={`item_${i}`} onClick={() => itemClick(item)}>
              <h3>{item.item_name}</h3>
            </div>);
        }
          return (
            <div key={i} className={`item_${i}`}>
              <img alt={item.item_name} src={item.item_image} style={{ width: '95%', height: '95%' }} onClick={() => itemClick(item)}/>
            </div>);
      })
    }
  </div>
);

export default SaleItems;
