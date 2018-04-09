import React from 'react';
import { Link } from 'react-router-dom';

const ManagerNav = () => (

  <div className="manager-navigation">
    <Link to="/managerhome" className="item">
      Home
    </Link>
    <Link to="/employeeinfo" className="item">
      Employees
    </Link>
    <Link to="/inventoryinfo" className="item">
      Inventory
    </Link>
    <Link to="/saleinfo" className="item">
      Sales
    </Link>
    <Link to="/managercustomize" className="item">
      Customize
    </Link>
  </div>
);

export default ManagerNav;
