import React, { Component } from 'react';
import {Redirect,Switch, Route} from 'react-router-dom'
import Login from './Components/Login'
import MainMenu from './Components/MainMenu'
import {ProtectedRoute} from './ProtectedRoute'
import NotFound from './Components/NotFound'
import './App.css';



class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Login}/>
          <ProtectedRoute path="/app" component={MainMenu}/>
          <Route path = "*" component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default App