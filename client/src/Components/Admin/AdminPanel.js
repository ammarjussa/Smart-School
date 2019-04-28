import React, { Component } from 'react';
import {Route,Switch} from 'react-router'
import auth from '../../auth';
import { Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'
import AdminDashboard from './AdminDashboard'
import NotFound from '../NotFound'
import Faculty from './AdminFaculty'
import {FormControl,Form,Navbar,Tab,Nav,Table, Alert, Modal, Container, Col, Row, Card, Button } from 'react-bootstrap';
import { FaPowerOff} from "react-icons/fa";
import ResultsTab from './AdminResults';
import StudentsTab from './AdminStudents';
import ClassesTab from './AdminClasses';

class AdminPanel extends Component {
  
  handleItemClick = (eventKey) => {
    this.props.history.push("/admin/" + eventKey)
  }

  componentDidMount(){
    this.props.history.push("/admin/Dashboard")
  }

  logout = () => {
    auth.logout(()=> {
      this.props.history.push("/")
    })
  }

  render() {
    return (
      <div>
        <Navbar style={{backgroundColor:"grey"}} sticky="top">
          <Navbar.Brand style={{fontSize: "20px"}}>Smart School Managment System</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end" >
          <Button variant="outline-warning" onClick={this.logout} > <FaPowerOff/> Logout</Button>
          
          </Navbar.Collapse>
        </Navbar>

        <Tab.Container id="left-tabs-example" defaultActiveKey="Dashboard">
          <Row>
            <Col sm={3}>
              <Nav sticky="top" variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link onSelect={this.handleItemClick} eventKey="Dashboard">Dasboard</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onSelect={this.handleItemClick} eventKey="Students">Students</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onSelect={this.handleItemClick} eventKey="Classes">Classes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onSelect={this.handleItemClick} eventKey="Faculty">Faculty</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onSelect={this.handleItemClick} eventKey="Results">Send Results</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                {/* <Tab.Pane eventKey="Dashboard">            
                      <AdminDashboard/>
                </Tab.Pane>
                <Tab.Pane eventKey="Students">            
                      <NotFound/>
                </Tab.Pane>
                <Tab.Pane eventKey="Classes">            
                      <NotFound/>
                </Tab.Pane>
                <Tab.Pane eventKey="Faculty"> 
                      {}           
                      <Faculty/>
                </Tab.Pane>
                <Tab.Pane eventKey="Results">            
                      <NotFound/>
                </Tab.Pane> */}
                <br/>
                <Switch>
                <Route path="/admin/Dashboard" component={AdminDashboard}/>
                <Route path="/admin/Students" component={StudentsTab}/>
                <Route path="/admin/Classes" component={ClassesTab}/>
                <Route path="/admin/Faculty" component={Faculty}/>
                <Route path="/admin/Results" component={ResultsTab}/>
                <Route path="/admin/*" component={NotFound}/>
              </Switch>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}

export default AdminPanel;
