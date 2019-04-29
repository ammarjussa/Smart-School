import React, { Component } from 'react';
import {Redirect, Switch, Route} from 'react-router-dom'
import Login from './Components/Login'
import AdminDashboard from './Components/Admin/AdminPanel'
import FacultyDashboard from './Components/Faculty/FacultyPanel'
import {ProtectedRoute} from './ProtectedRoute'
import NotFound from './Components/NotFound'
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.connecToServer = this.connecToServer.bind(this);
  }
  connecToServer() {
    fetch('/');
  }

  componentDidMount() {
    this.connecToServer();
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Login}/>
          <ProtectedRoute path="/admin" component={AdminDashboard}/>
          <ProtectedRoute path="/faculty" component={FacultyDashboard}/>
          <Route path = "*" component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default App