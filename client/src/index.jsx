import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRedirect } from 'react-router';
import createHistory from 'history/createBrowserHistory';

import App from './components/app.jsx';
import ManagerHome from './components/managerHome.jsx';
import InventoryInfo from './components/inventoryInfo.jsx';
import EmployeeInfo from './components/employeeInfo.jsx';
import SaleInfo from './components/saleInfo.jsx';
import Login from './components/login.jsx';
import TransactionCredit from './components/transactionCredit.jsx';
import TransactionCash from './components/transactionCash.jsx';
import TransactionCashConfirm from './components/transactionCashConfirm.jsx';
import SaleControl from './components/saleControl.jsx';
import KitchenLog from './components/kitchenLog.jsx';
import ManagerCustomize from './components/managerCustomize.jsx';
import HomePage from '../landingPage/homepage.jsx';

const history = createHistory();

ReactDOM.render(
  <div>
    <Router history={history}>
      <div>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={Login} status={401} />
        <Route path="/salesScreen" component={App} />
        <Route path="/managerhome" component={ManagerHome} />
        <Route path="/employeeinfo" component={EmployeeInfo} />
        <Route path="/inventoryinfo" component={InventoryInfo} />
        <Route path="/saleinfo" component={SaleInfo} />
        <Route path="/managercustomize" component={ManagerCustomize} />
        <Route path="/transaction/cash" component={TransactionCash} />
        <Route path="/transaction/cash/confirm" component={TransactionCashConfirm} />
        <Route path="/transaction/credit" component={TransactionCredit} />
        <Route path="/kitchenScreen" component={KitchenLog} />
      </div>
    </Router>
  </div>,
  document.getElementById('app'),
);
