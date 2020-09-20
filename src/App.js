import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Day from './components/DateWise/Day';

import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login/Login';


function App() {
  return (
    <BrowserRouter>
    <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/day" component={Day} />
   </Switch> 
  </BrowserRouter>
  );
}

export default App;
