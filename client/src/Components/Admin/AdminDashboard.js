import React, { Component } from 'react';
import {Route,Switch} from 'react-router'
import auth from '../../auth';
import Profile from '../../Profile'

class AdminDashboard extends Component {
  render() {
    return (
      <div>
        <h1>Admin Dashboard</h1>
        <p> Welcome {Profile.getEmail()} </p>
      </div>
    );
  }
}

export default AdminDashboard;