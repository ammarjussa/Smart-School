import React, { Component } from 'react';
import {Route,Switch} from 'react-router'
import auth from '../auth';


class MainMenu extends Component {
  render() {
    return (
      <div>
        <h1>MainMenu</h1>
        <button onClick={() => {
          auth.logout(()=> {
            this.props.history.push("/")
          })
        }} >logout</button>
      </div>
    );
  }
}

export default MainMenu;
