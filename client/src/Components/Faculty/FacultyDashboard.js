import React, { Component } from 'react';
import {Route,Switch} from 'react-router'
import {Breadcrumb} from 'react-bootstrap'
import Profile from '../../Profile'


class FacultyDashboard extends Component {
  render() {
    return (
      <div>
        <h1>Faculty Dashboard</h1>
        <p>Welcome {Profile.getEmail()}</p>
      </div>
    );
  }
}

export default FacultyDashboard;