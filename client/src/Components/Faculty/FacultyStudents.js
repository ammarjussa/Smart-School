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
    Navbar
} from 'react-bootstrap';
import { FaEye,FaTrashAlt,FaPlus} from "react-icons/fa";
import { Input, ModalHeader } from 'semantic-ui-react';
import axios from "axios"



class FStudentsTab extends Component {
  
    state = {
      studentData: [
        {
            studentid: 1,
            name: '-',
            theclass: '---',
            section: '---',
        },
        {
            studentid: 1,
            name: '-',
            theclass: '---',
            section: '---',
        },
        {
            studentid: 1,
            name: '-',
            theclass: '---',
            section: '---',
        },
        {
            studentid: 1,
            name: '-',
            theclass: '---',
            section: '---',
        },
        {
            studentid: 1,
            name: '-',
            theclass: '---',
            section: '---',
        },
     ],
      studentDataBackup: [],
      selectAll: false,
      view_isview:false,
      view_id: '',
      edit:{
          id: '',
          isEdit: false
      },
      Search: ''
  }
  
  
  componentDidMount(){
      //Extract data 
      let resp;              
      axios.post("/students","ack").then((res) => {
          
          //Make all check false
            this.setState({
                studentData: res.data.students,
                studentDataBackup : res.data.students
            })
      }).catch((e) => alert(e))
  }
  
  
  handleChangeCheckbox = (e) => {
    console.log(e)
  }
  
  handleViewModalClose = () =>{
    var prevState = Object.assign({},this.state)
    prevState.view_isview = false
    this.setState(prevState)
  } 
  
  handleViewModalShow = (ev) =>{
    var prevState = Object.assign({},this.state)
    prevState.view_isview = true
    this.setState(prevState)
  } 
  
  get_student(id,cb) {
    let count = 0
    this.state.studentData.forEach(f => {
        if(f.name===id && count<1)
        {
            count = count + 1
            console.log(f)
            cb(f)
        }
    });
  }
  
  handleView = () => {
  
    //this.handleViewModalShow()
    //this.handleViewModalClose()
  }
  
  handleEdit = () => {
  
  }
  
  
  handleSearch = (e) => {
    e.preventDefault()
    this.setState({Search:e.target.value}, ()=>{
        console.log(this.state.Search)
        let tempvalue = this.state.Search 
        this.setState((prevState) => {
                return {studentData: prevState.studentDataBackup.filter((f)=> f.name.toLowerCase().includes(tempvalue.toLowerCase()))}
        })
    })
    
    
  }
  
  
    render() {
      return (
        <div>
          <h1>My Students Information</h1>
        <div>
                {/* BreadCrumbs */}
                <Breadcrumb>
                    <Breadcrumb.Item href="/faculty/Dashboard">Admin</Breadcrumb.Item>
                    <Breadcrumb.Item active>Send Results</Breadcrumb.Item>
                </Breadcrumb>
  
  
                  {/* View/Edit Model */}
                  <Modal
                      show={this.state.view_isview}
                      onHide={this.handleViewModalClose}
                      size="sm"
                      centered
                  >
                      <Modal.Header closeButton>
                          <Modal.Title>Student Information</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <Container>
                              this.getFaculty()
                          </Container>
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleViewModalClose}>Close</Button>
                          <Button variant="danger" onClick={this.handleView}>Edit</Button>
                      </Modal.Footer>
                  </Modal>
  
  
                  <br/>
  
  
                  <Container>
                    <Row>
                      <Col xs={7} sm={9}>
                      <Input type="text" value={this.state.Search} onChange={this.handleSearch} placeholder="Search Student name"></Input>
                      </Col>
                    </Row>
                  </Container>
  
  
                  <br/>
  
                  {/* Table */}
                  <Table responsive hover>
                      <thead>
                          <th><InputGroup.Checkbox checked={this.state.selectAll} onChange={this.handleChangeSelectAll}/></th>
                          <th> id</th>
                          <th> Name</th>
                          <th> Class-Section </th>
                          <th>     </th>
                      </thead>
                      <tbody>
  
                          {
                              this.state.studentData.map(({section,theclass,name},id) => 
                                  <tr key={id}>
                                      <td><InputGroup.Prepend><InputGroup.Checkbox /> </InputGroup.Prepend> </td>
                                      <td>{id}</td>
                                      <td>{name}</td>
                                      <td>{`${theclass}-${section}`}</td>
                                      <td>
                                          {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">View/Edit</Tooltip>}>
                                              <span className="d-inline-block"> */}
                                                  <Button variant="success" onClick={this.handleView}> <FaEye/> View/Edit</Button>
                                                  <Button variant="danger" onClick={(e) => this.handleDeleteTid(e,name)}> <FaTrashAlt/> Delete</Button>
                                              {/* </span>
                                              </OverlayTrigger> */}
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
  
  export default FStudentsTab;