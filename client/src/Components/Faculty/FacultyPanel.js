import React, { Component } from 'react';
import {Route,Switch} from 'react-router'
import auth from '../../auth';
import {Navbar,Tab,Nav, Container, Col, Row, Button } from 'react-bootstrap';
import {FaPowerOff} from "react-icons/fa";
import FacultyDashboard from './FacultyDashboard'
import FStudentsTab from './FacultyStudents';
import Attendence from './FacultyAttendence';
import NotFound from '../NotFound'

class FacultyPanel extends Component {
  
  handleItemClick = (eventKey) => {
    this.props.history.push("/faculty/" + eventKey)
  }

  componentDidMount(){
    this.props.history.push("/faculty/Dashboard")
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
                  <Nav.Link onSelect={this.handleItemClick} eventKey="Attendence">Attendence</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <br/>
                <Switch>
                <Route path="/faculty/Dashboard" component={FacultyDashboard}/>
                <Route path="/faculty/Students" component={FStudentsTab}/>
                <Route path="/faculty/Attendence" component={Attendence}/>
                <Route path="/faculty/*" component={NotFound}/>
              </Switch>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}

export default FacultyPanel;