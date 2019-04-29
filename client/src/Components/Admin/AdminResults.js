import React, { Component } from 'react';
import {Route,Switch} from 'react-router'
import {Breadcrumb} from 'react-bootstrap'


class ResultsTab extends Component {
  render() {
    return (
      <div>
        <h1>Results Information</h1>
        <div>
                {/* BreadCrumbs */}
                <Breadcrumb>
                    <Breadcrumb.Item href="/admin/Dashboard">Admin</Breadcrumb.Item>
                    <Breadcrumb.Item active>Send Results</Breadcrumb.Item>
                </Breadcrumb>
        </div>
      </div>
    );
  }
}

export default ResultsTab;