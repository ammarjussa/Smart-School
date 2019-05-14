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
import Profile from '../../Profile'



class FStudentsTab extends Component {
  
    state = {
      studentData: [],
      studentDataBackup: [],
      selectAll: false,
      view_isview:false,
      view_object:{},
      view_id: '',
      showedit: false,
      Search: '',
      q1: 0,
      q2: 0,
      q3: 0,
      midterm: 0,
      final: 0,
  }
  
  
  componentDidMount(){
      //Extract data 
      let email = Profile.getEmail()              
      // axios.post("/facultystudents",{email}).then((res) => {
          
      axios.post("/students",{email}).then((res) => {
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
        if(f._id===id && count<1)
        {
            count = count + 1
            console.log(f)
            cb(f)
        }
    });
  }
  
  handleView(e,_id,name) {
    // e.preventDefault()
    console.log(_id)
    this.get_student(_id,(fObject) => {
      this.setState({
        view_object: fObject,
        view_isview: true
      })
    })

  }
  
  handleEdit = () => {
    this.setState({showedit: true})
  }

  handleEditUpdate = () => {///////////////////////////////////////////////////////////////////
    this.setState({updating: true})
    let obj = this.state.view_object
        
        let facultyInfo = {

            "id": obj._id,
            "q1": obj.q1,
            "q2": obj.q2,
            "q3": obj.q3,
            "midterm": obj.midterm,
            "final": obj.final,
        }

        console.log(facultyInfo)
        axios.post("/grade",facultyInfo).then((res)=>{
            console.log(res.data.message)
            if(res.data.message === "Success")
            {
                this.setState({updating:false})
                // var prevState = Object.assign({},this.state)
                // prevState.add_showmodal = false
                // prevState.view_object.class= ''
                // prevState.view_object.subject= ''
                // prevState.view_object.gender= ''
                // prevState.view_object.name= ''
                // prevState.view_object.contact= ''
                // prevState.view_object.email= ''
                // let fd = prevState.facultyData
                // prevState.facultyData = fd
                // this.setState(prevState)
                this.setState({showedit: false})
            }
            else{
                alert("Something went Wrong!")
            }


        }).catch((e) => console.log(e))
}

handleEditInputs = (ev) => {
  ev.preventDefault()
  let {name,value} = ev.target
  console.log(name,value)
  var prevState = Object.assign({},this.state)
  prevState.view_object[name] = value
  this.setState(prevState)
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
                      {this.state.showedit?
                        <Modal.Title>Edit Academic Information</Modal.Title>
                        :
                        <Modal.Title>Academic Information</Modal.Title>}
                      </Modal.Header>
                      <Modal.Body>
                      {/* <Nav fill variant="tabs" defaultActiveKey="/home">
                        <Nav.Item>
                            <Nav.Link onSelect={this.handleItemClick} eventKey="P">Personal Info</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onSelect={this.handleItemClick} eventKey="A">Academic Info</Nav.Link>
                        </Nav.Item>
                      </Nav> */}
                         {this.state.showedit?
                        <Form onSubmit={this.state.view_isview}>
                        <div>
                        <Form.Row>
                            <Form.Group as={Col}>
                            <Form.Label>Quiz 1:</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    min="0"
                                    max="10"
                                    placeholder=""
                                    name="q1"
                                    value={this.state.view_object.q1}
                                    onChange={this.handleEditInputs}
                                    />
                                </Form.Group>                               
                            </Form.Row>
                        
                        <Form.Row>
                        
                        <Form.Group as={Col}>
                        <Form.Label>Quiz 2:</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                min="0"
                                max="10"
                                placeholder=""
                                name="q2"
                                value={this.state.view_object.q2}
                                onChange={this.handleEditInputs}
                                />
                            </Form.Group>                               
                        </Form.Row>
                        
                        <Form.Row>
                        <Form.Group as={Col}>
                        <Form.Label>Quiz 3:</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                min="0"
                                max="10"
                                placeholder=""
                                name="q3"
                                value={this.state.view_object.q3}
                                onChange={this.handleEditInputs}
                                />
                            </Form.Group>                               
                        </Form.Row>


                        <Form.Row>
                        
                        <Form.Group as={Col}>
                        <Form.Label>Midterm:</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                min="0"
                                max="100"
                                placeholder=""
                                name="midterm"
                                value={this.state.view_object.midterm}
                                onChange={this.handleEditInputs}
                                />
                            </Form.Group>                               
                        </Form.Row>


                        <Form.Row>
                        
                        <Form.Group as={Col}>
                        <Form.Label>Final:</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                min = "0"
                                max = "100"
                                placeholder=""
                                name="final"
                                value={this.state.view_object.final}
                                onChange={this.handleEditInputs}
                                />
                            </Form.Group>                               
                        </Form.Row>
                          

                      </div>
                    </Form>
                    :
                        <Container>
                          <Row><h4>Student Information: </h4></Row>
                            <Row>
                                <Col>
                                    <b>ID:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object._id}
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <b>Name:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.name}
                                </Col>
                            </Row>


                            <br/>
                            <Row><h4>Graded Instruments: </h4></Row>
                            <Row>
                                <Col>
                                    <b>Quiz 1:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.q1}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <b>Quiz 2:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.q2}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <b>Quiz 3:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.q3}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <b>Midterm:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.midterm}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <b>Final:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.final}
                                </Col>
                            </Row>


                          
                        </Container>
                      
                      
                      }



                      </Modal.Body>
                      <Modal.Footer>
                      {this.state.showedit?
                        <div>
                            {
                            this.state.updating?
                                <Button variant="warning" disabled >Updating...</Button>
                                :
                                <Button variant="warning" onClick={this.handleEditUpdate}>Update</Button>
                            }
                        </div>
                        :
                        <div>
                        {/* <Button variant="secondary" onClick={this.handleViewModalClose}>Close</Button> */}
                        <Button variant="danger" onClick={this.handleEdit}>Edit</Button>
                        </div>}
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
                              this.state.studentData.map(({section,theclass,name,_id},id) => 
                                  <tr key={id}>
                                      <td><InputGroup.Prepend><InputGroup.Checkbox /> </InputGroup.Prepend> </td>
                                      <td>{_id}</td>
                                      <td>{name}</td>
                                      <td>{`${theclass}-${section}`}</td>
                                      <td>
                                        <Button variant="success" onClick={(e) => this.handleView(e,_id,name)}> <FaEye/> View/Edit</Button>
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