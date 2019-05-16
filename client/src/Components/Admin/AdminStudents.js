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


class StudentsTab extends Component {
  
  state = {
    studentData: [],
    studentDataBackup: [],
    selectAll: false,
    view_isview: false,
    view_object: {},
    add_showmodal:false,
    add_studentid: null,
    theclass: '',
    section: '',
    gender: '',
    name: '',
    pname: '',
    pcontact: '',
    pemail: '',
    delete_last_deleted: {},
    delete_last_deleted_id: null,
    delete_showmodal: false,
    adding: false,
    showedit: false,
    Search: ''
}


componentDidMount(){
    //Extract data 
    let resp;
    // axios.post("/students","ack").then((res) => {
        
        //     //Make all check false
        //       this.setState({
            //           studentData: res.data.students,
            //           studentDataBackup : res.data.students
            //       })
            // }).catch((e) => alert(e))
            
    let path = "/students"
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

handleDeleteModalClose = () =>{
  
  var prevState = Object.assign({},this.state)
  prevState.delete_showmodal = false
  this.setState(prevState)
} 

handleDeleteModalShow = () =>{
  var prevState = Object.assign({},this.state)
  prevState.delete_showmodal = true
  this.setState(prevState)
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

handleDelete = (e) => {

  e.preventDefault()

  this.get_student(this.state.delete_last_deleted_id, (fObject) => {

      var prevState = Object.assign({},this.state)
      prevState.delete_last_deleted = fObject 
      this.setState(prevState, () => {
          let del_Obj = {
              id:fObject._id
          }

      axios.post("/deleteStudent",del_Obj).then((res) => {
          // var prevState = Object.assign({},this.state)
          // prevState.facultyData = this.state.facultyData.filter((f) => f.studentid !== del_Obj.studentid && f.email !== del_Obj.email)
          // this.setState(prevState)
          var prevState = Object.assign({},this.state)
          let fd = prevState.studentData
          fd = fd.filter((f) => f._id !== fObject._id)
          prevState.studentData = fd
          prevState.studentDataBackup = fd
          this.setState(prevState)
          this.handleDeleteModalClose()
      }).catch((e) => alert(e))

      })
  })

  
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

handleView = (e,id) => {
    this.get_student(id,(fObject) => {
        this.setState({
            view_object: fObject,
            view_isview : true
        })

    })
}

handleDeleteTid = (e,id)  =>{
  var prevState = Object.assign({},this.state)
  prevState.delete_showmodal=true
  prevState.delete_last_deleted_id = id
  this.setState(prevState)
}

handleAddModalClose = () =>{
  var prevState = Object.assign({},this.state)
  prevState.add_showmodal = false
  this.setState(prevState)
}

handleAddModalShow = () =>{
  var prevState = Object.assign({},this.state)
  prevState.add_showmodal = true
  this.setState(prevState)
}

handleSubmitAddStudent = (e) => {
  e.preventDefault()
  let obj = this.state
      let studentInfo = {

          "name": obj.name,
          "pcontact": obj.pcontact,
          "gender": obj.gender,
          "pemail": obj.pemail,
          "section": obj.section,
          "theclass": obj.class,
          "pname": obj.pname,
      }

      console.log(studentInfo)
      axios.post("/registerStudent",studentInfo).then((res)=>{
          console.log(res.data.message)
          this.setState({adding:false})
          if(res.data.message === "Success")
          {

            let studentInfo = {
                "_id": res.data.theid,
                "name": obj.name,
                "pcontact": obj.pcontact,
                "gender": obj.gender,
                "pemail": obj.pemail,
                "section": obj.section,
                "theclass": obj.class,
                "pname": obj.pname,
            }
              var prevState = Object.assign({},this.state)
              prevState.add_showmodal = false
              prevState.theclass= ''
              prevState.section= ''
              prevState.gender= ''
              prevState.name= ''
              prevState.pcontact= ''
              prevState.pemail= ''
              prevState.pname= ''
              let fd = prevState.studentData
              fd.push(studentInfo)
              prevState.studentData = fd
              this.setState(prevState)
          }
          else if(res.data.message==="Unsuccessful") {
              alert("Duplicate Student Detected!")
              var prevState = Object.assign({},this.state)
              prevState.theclass= ''
              prevState.section= ''
              prevState.gender= ''
              prevState.name= ''
              prevState.pcontact= ''
              prevState.pemail= ''
              prevState.pname= ''
              this.setState(prevState)
          }
          else{
              alert("Something Went Wrong!")
          }


      }).catch((e) => alert(e))
}

handleEdit = () => {
    this.setState({showedit: true})
}

handleEditUpdate = () => {
    this.setState({updating: true})
    let obj = this.state.view_object
        
        let studentInfo = {

            "id": obj._id,
            "name": obj.name,
            "pcontact": obj.pcontact,
            "gender": obj.gender,
            "pemail": obj.pemail,
            "pname" : obj.pname,
            "section": obj.section,
            "theclass": obj.theclass,
            "subject": obj.subject,
        }

        console.log(studentInfo)
        axios.post("/updatestudent",studentInfo).then((res)=>{
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

handleAddInputs = (ev) => {
  ev.preventDefault()
  let {name,value} = ev.target
  console.log(name,value)
  var prevState = Object.assign({},this.state)
  prevState[name] = value
  this.setState(prevState)
}

handleEditInputs = (ev) => {
    ev.preventDefault()
    let {name,value} = ev.target
    console.log(name,value)
    var prevState = Object.assign({},this.state)
    prevState.view_object[name] = value
    this.setState(prevState)
}

adding = (e) =>{
    e.preventDefault()
    this.setState({adding: true})
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
        <h1>Students Information</h1>
        <div>
                {/* BreadCrumbs */}
                <Breadcrumb>
                    <Breadcrumb.Item href="/admin/Dashboard">Admin</Breadcrumb.Item>
                    <Breadcrumb.Item active>View Students</Breadcrumb.Item>
                </Breadcrumb>


                {/* Delete Modal */}
                <Modal
                    show={this.state.delete_showmodal}
                    onHide={this.handleDeleteModalClose}
                    size="sm"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleDeleteModalClose}>No</Button>
                        <Button variant="danger" onClick={this.handleDelete}>Yes</Button>
                    </Modal.Footer>
                </Modal>


                {/* View/Edit Model */}
                <Modal
                    show={this.state.view_isview}
                    onHide={this.handleViewModalClose}
                    size="md"
                    centered
                >
                    <Modal.Header closeButton>
                    {this.state.showedit?
                        <Modal.Title>Edit Student Information</Modal.Title>
                        :
                        <Modal.Title>Student Information</Modal.Title>}
                    </Modal.Header>
                    <Modal.Body>
                      {this.state.showedit?
                        <Form onSubmit={this.handleSubmitAddStudent}>

                        <div>
                          <Form.Row>
                                        <Form.Group as={Col}>
                                        <Form.Label>Name:</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                // placeholder="Enter Student Name"
                                                name="name"
                                                value={this.state.view_object.name}
                                                onChange={this.handleEditInputs}
                                                />
                                            </Form.Group>
                                           
                                        </Form.Row>

                                        <Form.Row>
                                        <Form.Group as={Col}>
                                        <Form.Label>Gender:</Form.Label>
                                            <Form.Control
                                             required
                                             name="gender"
                                             value={this.state.view_object.gender}
                                             onChange={this.handleEditInputs}
                                             as="select"
                                             >
                                                <option>Gender...</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                            </Form.Control>
                                            </Form.Group>

                                           
                                        </Form.Row>

                                        <Form.Row>

                                            <Form.Group as={Col}>
                                            <Form.Label>Class:</Form.Label>
                                            <Form.Control
                                             name="theclass"
                                             value={this.state.view_object.theclass}
                                             onChange={this.handleEditInputs}
                                             as="select">
                                                <option>Class...</option>
                                                <option>6</option>
                                                <option>7</option>
                                                <option>8</option>
                                            </Form.Control>
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                            <Form.Label>Section:</Form.Label>
                                            <Form.Control 
                                             name="section"
                                             value={this.state.view_object.section}
                                             onChange={this.handleEditInputs}
                                            as="select">
                                                <option>Section...</option>
                                                <option>A</option>
                                                <option>B</option>
                                                <option>C</option>
                                            </Form.Control>
                                            </Form.Group>
                                        </Form.Row>

                                        <Form.Row>
                                        <Form.Group as={Col}>
                                        <Form.Label>Parent's Name:</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                //placeholder="Enter Parent's Name"
                                                name="pname"
                                                value={this.state.view_object.pname}
                                                onChange={this.handleEditInputs}
                                                />
                                            </Form.Group>
                                           
                                        </Form.Row>

                                        <Form.Row>
                                            <Form.Group as={Col}>
                                            <Form.Label>Parent's Email:</Form.Label>
                                                <Form.Control
                                                name="pemail"
                                                value={this.state.view_object.pemail}
                                                onChange={this.handleEditInputs}
                                                required
                                                type="email"
                                                // placeholder="Parent's Email"
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                            <Form.Label>Parent's Contact:</Form.Label>
                                                <Form.Control
                                                 name="pcontact"
                                                 value={this.state.view_object.pcontact}
                                                 onChange={this.handleEditInputs}
                                                required
                                                type="text"
                                                // placeholder="Enter Parent's Contact"
                                                />
                                            </Form.Group>


                                        </Form.Row>

                            
                            </div>
                    </Form>


                        :

                        <Container>
                            <Row><h4>Personal Information</h4></Row>
                            <Row>
                                <Col>
                                    <b>Name:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.name}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <b>Gender:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.gender}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <b>Class:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.theclass}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <b>Section:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.section}
                                </Col>
                            </Row>
                            <br/>
                            <Row><h4>Parent's/Guardian's Information</h4></Row>
                            <Row>
                                <Col>
                                    <b>Name:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.pname}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <b>Email:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.pemail}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <b>Contact:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.pcontact}
                                </Col>
                            </Row>
                        </Container>}
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

                {/* Add Faculty */}
                <Modal
                    show={this.state.add_showmodal}
                    size="md"
                    centered
                >
                    <Modal.Header> 
                        <Modal.Title>Add Student</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card>
                            <Card.Body>
                                <Form onSubmit={this.handleSubmitAddStudent}>
                                    <div>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                        <Form.Label>Name:</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                // placeholder="Enter Student Name"
                                                name="name"
                                                value={this.state.name}
                                                onChange={this.handleAddInputs}
                                                />
                                            </Form.Group>
                                           
                                        </Form.Row>

                                        <Form.Row>
                                        <Form.Group as={Col}>
                                        <Form.Label>Gender:</Form.Label>
                                            <Form.Control
                                             required
                                             name="gender"
                                             value={this.state.gender}
                                             onChange={this.handleAddInputs}
                                             as="select"
                                             >
                                                <option>Gender...</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                            </Form.Control>
                                            </Form.Group>

                                           
                                        </Form.Row>

                                        <Form.Row>

                                            <Form.Group as={Col}>
                                            <Form.Label>Class:</Form.Label>
                                            <Form.Control
                                             name="theclass"
                                             value={this.state.theclass}
                                             onChange={this.handleAddInputs}
                                             as="select">
                                                <option>Class...</option>
                                                <option>6</option>
                                                <option>7</option>
                                                <option>8</option>
                                            </Form.Control>
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                            <Form.Label>Section:</Form.Label>
                                            <Form.Control 
                                             name="section"
                                             value={this.state.section}
                                             onChange={this.handleAddInputs}
                                            as="select">
                                                <option>Section...</option>
                                                <option>A</option>
                                                <option>B</option>
                                                <option>C</option>
                                            </Form.Control>
                                            </Form.Group>
                                        </Form.Row>

                                        <Form.Row>
                                        <Form.Group as={Col}>
                                        <Form.Label>Parent's Name:</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                               // placeholder="Enter Parent's Name"
                                                name="pname"
                                                value={this.state.pname}
                                                onChange={this.handleAddInputs}
                                                />
                                            </Form.Group>
                                           
                                        </Form.Row>

                                        <Form.Row>
                                            <Form.Group as={Col}>
                                            <Form.Label>Parent's Email:</Form.Label>
                                                <Form.Control
                                                name="pemail"
                                                value={this.state.pemail}
                                                onChange={this.handleAddInputs}
                                                required
                                                type="email"
                                                // placeholder="Parent's Email"
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                            <Form.Label>Parent's Contact:</Form.Label>
                                                <Form.Control
                                                 name="pcontact"
                                                 value={this.state.pcontact}
                                                 onChange={this.handleAddInputs}
                                                required
                                                type="text"
                                                // placeholder="Enter Parent's Contact"
                                                />
                                            </Form.Group>


                                        </Form.Row>

                                        <Button type="submit" ><FaPlus/> Add </Button>
                                        </div>
                                </Form>
                            </Card.Body>
                        </Card> 
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleAddModalClose}>Close</Button>
                    </Modal.Footer>
                </Modal>


                <br/>


                {/* Search Box and Add Faculty */}
                
                {/* <Navbar sticky="top">
                // <Input type="text" value={this.state.Search} onChange={this.handleSearch} placeholder="Search Student name"></Input>
                      <Navbar.Collapse className="justify-content-end" >
                            <Button onClick={this.handleAddModalShow}> <FaPlus/> Add Student</Button>
                      </Navbar.Collapse>
                </Navbar> */}

                <Container>
                  <Row>
                    <Col xs={7} sm={9}>
                    <Input type="text" value={this.state.Search} onChange={this.handleSearch} placeholder="Search Student name"></Input>
                    </Col>
                    <Col>
                    <Button onClick={this.handleAddModalShow}> <FaPlus/> Add Student</Button>
                    </Col>
                  </Row>
                </Container>



                {/* <div style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                     <span style={{ paddingLeft: "10px" }}><Input type="text" value={this.state.Search} onChange={this.handleSearch} placeholder="Search Student name"></Input></span>
                     <span  style={{ paddingLeft: "600px" }}><Button onClick={this.handleAddModalShow}> <FaPlus/> Add Student</Button></span>
                </div>    */}

                <br/>

                {/* Table */}
                <Table responsive hover>
                    <thead>
                        <th> id</th>
                        <th> Name</th>
                        <th> Class-Section </th>
                        <th>     </th>
                    </thead>
                    <tbody>

                        {
                            this.state.studentData.map(({section,theclass,name,_id},id) => 
                                <tr key={id}>
                                    <td>{_id}</td>
                                    <td>{name}</td>
                                    <td>{`${theclass}-${section}`}</td>
                                    <td>
                                        {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">View/Edit</Tooltip>}>
                                            <span className="d-inline-block"> */}
                                            <Container>
                                                <Row>
                                                <Col xs={4.5}>
                                                
                                                <Button variant="success" onClick={(e)=>this.handleView(e,_id)}> <FaEye/> View/Edit</Button>
                                                </Col>
                                                <Col>
                                                <Button variant="danger" onClick={(e) => this.handleDeleteTid(e,_id)}> <FaTrashAlt/> Delete</Button>
                                                </Col>
                                                </Row>

                                            </Container>
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

export default StudentsTab;