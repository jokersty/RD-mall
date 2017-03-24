import React, {PropTypes} from 'react';
import {Router, Route, IndexRoute} from 'dva/router';
import Home from './routes/Home/Home';
import PayResult from './routes/PayResult/PayResult';
import Addresses from './routes/Addresses/Addresses';
import AddAddress from './routes/Addresses/AddAddress';
import ProductItem from './routes/Product/Item';
import WxPay from './routes/Product/WxPay';
import ProductList from './routes/Product/List';
import SelectCalendar from './routes/SelectCalendar/SelectCalendar';
import SelectCountry from './routes/SelectCountry/SelectCountry';
import AddCard from './routes/MyCard/AddCard';
// import MyCard from './routes/MyCard/MyCard';
import MyCardList from './routes/MyCard/List';
import Login from './routes/Login/Login';
import OrderList from './routes/OrderList/OrderList';
import OrderDetails from './routes/OrderDetails/OrderDetails';

export default function ({history}) {
  return (
    <Router history={history}>
      <Route path="/">
        <IndexRoute components={Home}/>
        <Route path="wxpay" components={WxPay}/>
        <Route path="pay/:result" components={PayResult}/>
        <Route path="addresses">
          <IndexRoute components={Addresses}/>
          <Route path="add" components={AddAddress}/>
          <Route path=":id" components={AddAddress}/>
        </Route>
        <Route path="products">
          <IndexRoute components={ProductList}/>
          <Route path=":cid">
            <IndexRoute components={ProductList}/>
            <Route path=":productid" components={ProductItem}/>
          </Route>
        </Route>
        <Route path="my-card">
          <IndexRoute components={MyCardList}/>
          <Route path="add" components={AddCard}/>
        </Route>
        <Route path="select-calendar" components={SelectCalendar}/>
        <Route path="select-country" components={SelectCountry}/>
        <Route path="login" components={Login}/>
        <Route path="order-list" components={OrderList}/>
        <Route path="order-details">
          <Route path=":orderid" components={OrderDetails}/>
        </Route>
      </Route>
    </Router>
  );
}
