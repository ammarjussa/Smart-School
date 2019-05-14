import React, { Component } from 'react';
import {Route,Switch} from 'react-router'
import {Table, InputGroup, Row, Col, Nav } from 'react-bootstrap'
import { 
    Card,
    Spinner,
    OverlayTrigger,
    Tooltip,
    Button,
    Container,
    Breadcrumb,
    Modal,
    Form,
    Navbar,
    ButtonGroup,
    ButtonToolbar,
    ToggleButton,
    ToggleButtonGroup,

} from 'react-bootstrap';
import { FaEye,FaTrashAlt,FaPlus} from "react-icons/fa";
import { Input, ModalHeader } from 'semantic-ui-react';
import axios from "axios"
import Profile from '../../Profile'


class Attendence extends Component {

  state = {
    studentData: [],
    studentDataBackup: [],
    selectAll: false,
    view_isview:false,
    view_id: '',
    Search: '',
  }

  componentDidMount(){
    //Extract data 
    let email = Profile.getEmail()              
    axios.post("/facultystudents",{email}).then((res) => {
        
        //Make all check false
          this.setState({
              studentData: res.data.students,
              studentDataBackup : res.data.students
          })
    }).catch((e) => alert(e))
}

markPresent(id) {
  let isPresent = true
  axios.post("/attendence",{id,isPresent}).then((res) => {
    if(res.data.message !== "Success")
    {
      alert(`Error: ${id}'s attendance not marked! `)
    }
  })
}

markAbsent(id) {
  let isPresent = false
  axios.post("/attendence",{id,isPresent}).then((res) => {
    if(res.data.message !== "Success")
    {
      alert(`Error: ${id}'s attendance not marked! `)
    }
  })
}


  render() {
    return (
      <div>
        <h1>Attendence</h1>
        <div>
                {/* BreadCrumbs */}
                <Breadcrumb>
                    <Breadcrumb.Item href="/faculty/Dashboard">Faculty</Breadcrumb.Item>
                    <Breadcrumb.Item active>attendance</Breadcrumb.Item>
                </Breadcrumb>
        </div>

        <div>
          <br/>
  
          {/* Table */}
          <Table responsive hover>
              <thead>
                  <th><InputGroup.Checkbox checked={this.state.selectAll} onChange={this.handleChangeSelectAll}/></th>
                  <th> id</th>
                  <th> Name</th>
                  <th> Class-Section </th>
                  <th> Days Present</th>
                  <th>  Attendence  </th>
              </thead>
              <tbody>

                  {
                      this.state.studentData.map(({section,theclass,name,_id,attendence,presenceNumber},id) => 
                          <tr key={id}>
                              <td><InputGroup.Prepend><InputGroup.Checkbox /> </InputGroup.Prepend> </td>
                              <td>{_id}</td>
                              <td>{name}</td>
                              <td>{`${theclass}-${section}`}</td>
                              <td> {presenceNumber} </td>
                              <td>

                                  <ButtonToolbar>
                                    <ToggleButtonGroup type="radio" name="options" defaultValue={false}>
                                      <ToggleButton value={true} variant="outline-success" onClick={() => this.markPresent(_id)}>Present</ToggleButton>
                                      <ToggleButton value={false} variant="outline-danger" onClick={() => this.markAbsent(_id)}>Absent</ToggleButton>
                                    </ToggleButtonGroup>
                                  </ButtonToolbar>
                              </td>
                              
                          </tr>
                      )

                  }

              </tbody>
          </Table>


        </div>
      </div>
    );
  }
}

export default Attendence;