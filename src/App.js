import React, { Fragment } from 'react';
import './App.css';
import landing from './components/home/landing'
import Navbar from './components/home/Navbar'
import Transfer from './components/home/Transfer'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Dashboard from './components/home/Dashboard';
import Receipt from './components/home/Receipt';
import FooterComponent from './components/FooterComponent';

function App() {
  return (
    <Router>
      <Fragment>
        <Navbar />
        
        <Route exact path="/" component={landing}/>
          <section className="container">
            <Switch>
              <Route exact path="/transfer" component={Transfer}/>
              <Route exact path="/Dashboard" component={Dashboard}/>
              <Route exact path="/receipt/:transaction_Id" component={Receipt}></Route>
            </Switch>
          </section>
          <FooterComponent />

      </Fragment>
    </Router>
  );
}

export default App;
