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


class ClassesTab extends Component {

    state = {
      classesData: [],
      classesDataBackup: [],
      selectAll: false,
      view_object: {},
      view_isview: false,
      add_showmodal:false,
      add_studentid: null,
      theclass: '',
      cap: '',
      section: '',
      delete_last_deleted: {},
      delete_last_deleted_id: null,
      delete_showmodal: false,
      adding: false,
      Search: '',
      showedit: false,
  }
  componentDidMount(){
      //Extract data 
      let resp;
      // axios.post("/students","ack").then((res) => {
          
          //     //Make all check false
          //       this.setState({
              //           classesData: res.data.students,
              //           classesDataBackup : res.data.students
              //       })
              // }).catch((e) => alert(e))
              
      axios.post("/showclass","ack").then((res) => {
          
          //Make all check false
            this.setState({
                classesData: res.data.classes,
                classesDataBackup : res.data.classes,
            })
      }).catch((e) => console.log("MyError:",e))
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
    this.setState({showedit: false})
  } 

  handleViewModalShow = (ev) =>{
    var prevState = Object.assign({},this.state)
    prevState.view_isview = true
    this.setState(prevState)
  } 

  handleDelete = (e) => {

    e.preventDefault()
    this.handleDeleteModalClose()
    // setTimeout(()=> this.handleDeleteModalClose(),3000)
    this.get_student(this.state.delete_last_deleted_id, (fObject) => {

        var prevState = Object.assign({},this.state)
        prevState.delete_last_deleted = fObject 
        this.setState(prevState, () => {
            let del_Obj = {
                id:fObject._id
            }

        axios.post("/deleteclass",del_Obj).then((res) => {
            // var prevState = Object.assign({},this.state)
            // prevState.classesData = this.state.classesData.filter((f) => f.studentid !== del_Obj.studentid && f.email !== del_Obj.email)
            // this.setState(prevState)
            console.log("Deleted", del_Obj.id)
            var prevState = Object.assign({},this.state)
            let fd = prevState.classesDataBackup
            fd = fd.filter((f) => f._id !== fObject._id)
            prevState.classesData = fd
            prevState.classesDataBackup = fd
            this.setState(prevState)
            this.handleDeleteModalClose()
        }).catch((e) => alert(e))

        })


    })
  }

  get_student(id,cb) {
    let count = 0
    this.state.classesData.forEach(f => {
        if(f._id===id && count<1)
        {
            count = count + 1
            console.log(f)
            cb(f)
        }
    });
  }

  handleDeleteTid = (e,id)  =>{
    var prevState = Object.assign({},this.state)
    prevState.delete_showmodal=true
    prevState.delete_last_deleted_id = id
    this.setState(prevState)
  }

  handleView = (e,id) => {
    this.get_student(id,(fObject) => {
        this.setState({
            view_object: fObject,
            view_isview : true
        })

    })
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
    if(obj.theclass==="" || obj.theclass==="Grade...")
    {
        alert("Please select a class")
    }
    else if(obj.section==="" || obj.theclass==="Section...")
    {
        alert("Please select a section")
    }
    else
    {
        this.setState({adding:true})
        let classInfo = {
            
            section: obj.section,
            theclass: obj.theclass,
            cap: obj.cap,
        }      
        console.log(classInfo)
        axios.post("/addclass",classInfo).then((res)=>{
            console.log(res.data.message)
            this.setState({adding:false})
            if(res.data.message === "Success")
            {
                this.setState({adding:false})
                let classInfo = {
                    _id: res.data.theid,
                    section: obj.section,
                    theclass: obj.theclass,
                    cap: obj.cap,
                } 

                var prevState = Object.assign({},this.state)
                prevState.add_showmodal = false
                prevState.theclass= ''
                prevState.cap= ''
                prevState.section= ''
                let fd = prevState.classesData
                fd.push(classInfo)
                prevState.classesData = fd
                prevState.classesDataBackup = fd
                this.setState(prevState)
            }
            else{
                alert("Something went Wrong!")
            }
            this.setState({add_showmodal:false})


        }).catch((e) => console.log(e))
    }
  }

  handleEdit = () => {
    this.setState({showedit: true})
  }


  handleEditUpdate = () => {
    this.setState({updating: true})
    let obj = this.state.view_object
        
       
    let classInfo = {
        
        id:obj._id,
        section: obj.section,
        theclass: obj.theclass,
        cap: obj.cap,
    }      

        console.log(classInfo)
        axios.post("/updateclass",classInfo).then((res)=>{
            console.log(res.data.message)
            if(res.data.message === "Success")
            {
                this.setState({updating:false})
                // var prevState = Object.assign({},this.state)
                // prevState.add_showmodal = false
                // prevState.view_object.theclass= ''
                // prevState.view_object.subject= ''
                // prevState.view_object.gender= ''
                // prevState.view_object.name= ''
                // prevState.view_object.contact= ''
                // prevState.view_object.email= ''
                // let fd = prevState.classesData
                // prevState.classesData = fd
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
        if (tempvalue)
        {
            this.setState((prevState) => {
                    return {classesData: prevState.classesDataBackup.filter((f)=> f.theclass===tempvalue)}
            })
            
        }
        else
        {
            this.setState((prevState) => {
                return {classesData: prevState.classesDataBackup}
            })

        }
    })
    
    
  }


  render() {
    return (
      <div>
        <h1>Classes Information</h1>
        <div>
                {/* BreadCrumbs */}
                <Breadcrumb>
                    {/* <Breadcrumb.Item href="/admin/Dashboard">Admin</Breadcrumb.Item> */}
                    <Breadcrumb.Item>Admin</Breadcrumb.Item>
                    <Breadcrumb.Item active>View Classes</Breadcrumb.Item>
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
                    size="sm"
                    centered
                >
                    <Modal.Header closeButton>
                    {this.state.showedit?
                        <Modal.Title>Edit class Information</Modal.Title>
                        :
                        <Modal.Title>class Information</Modal.Title>}
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.showedit?
                              <Form onSubmit={this.handleSubmitAddStudent}>
                              <div>

                                  <Form.Row>

                                      <Form.Group as={Col}>
                                      <Form.Label>class:</Form.Label>
                                      <Form.Control 
                                       name="theclass"
                                       value={this.state.view_object.theclass}
                                       disabled
                                       onChange = {this.handleEditInputs}
                                      as="select">                                             <option>Grade...</option>
                                          <option>5</option>
                                          <option>6</option>
                                          <option>7</option>
                                          <option>8</option>
                                          <option>9</option>
                                      </Form.Control>
                                      </Form.Group>
                                  </Form.Row>
                                  <Form.Row>

                                      <Form.Group as={Col}>
                                      <Form.Label>Section:</Form.Label>
                                      <Form.Control 
                                       name="section"
                                       disabled
                                       value={this.state.view_object.section}
                                       onChange={this.handleEditInputs}
                                      as="select">
                                          <option>Section...</option>
                                          <option>A</option>
                                          <option>B</option>
                                          <option>C</option>
                                          <option>D</option>
                                          <option>E</option>
                                          <option>F</option>
                                          <option>G</option>
                                          <option>H</option>
                                          <option>I</option>
                                          <option>J</option>
                                          <option>K</option>
                                          <option>L</option>
                                      </Form.Control>
                                      </Form.Group>
                                  </Form.Row>

                                  <Form.Row>
                                  <Form.Group as={Col}>
                                  <Form.Label>Cap:</Form.Label>
                                      <Form.Control
                                          required
                                          type="number"
                                          min = "20"
                                          max = "50"
                                          placeholder="Enter class Cap"
                                          name="cap"
                                          value={this.state.view_object.cap}
                                          onChange={this.handleEditInputs}
                                          />
                                    {/* <Form.Text className="text-muted">
                                        {"20 <= class Size <= 50"} 
                                    </Form.Text> */}
                                  </Form.Group>
                                     
                                  </Form.Row>

                                  </div>
                          </Form>
                        
                        
                        :
                        <Container>
                            <Row>
                                <Col>
                                    <b>class:</b>
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
                            <Row>
                                <Col>
                                    <b>Cap:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.cap}
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
                    onHide = {()=>this.setState({add_showmodal: false})}
                    size="sm"
                    centered
                >
                    <Modal.Header > 
                        <Modal.Title>Add class</Modal.Title>
                    </Modal.Header>
                        <Form onSubmit={this.handleSubmitAddStudent}>
                            <div>
                    <Modal.Body>
                        {/* <Card>
                            <Ca rd.Body>*/}

                                        <Form.Row>

                                            <Form.Group as={Col}>
                                            <Form.Label>class:</Form.Label>
                                            <Form.Control 
                                             name="theclass"
                                             value={this.state.theclass}
                                             onChange = {this.handleAddInputs}
                                            as="select">                                             <option>Grade...</option>
                                                <option>5</option>
                                                <option>6</option>
                                                <option>7</option>
                                                <option>8</option>
                                                <option>9</option>
                                            </Form.Control>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>

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
                                                <option>D</option>
                                                <option>E</option>
                                                <option>F</option>
                                                <option>G</option>
                                                <option>H</option>
                                                <option>I</option>
                                                <option>J</option>
                                                <option>K</option>
                                                <option>L</option>
                                            </Form.Control>
                                            </Form.Group>
                                        </Form.Row>

                                        <Form.Row>
                                        <Form.Group as={Col}>
                                        <Form.Label>Cap:</Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                min = "20"
                                                max = "50"
                                                placeholder="Enter class Cap"
                                                name="cap"
                                                value={this.state.cap}
                                                onChange={this.handleAddInputs}
                                                />
                                        </Form.Group>
                                           
                                        </Form.Row>

                            {/* </Card.Body>
                        </Card>  */}
                    </Modal.Body>
                    <Modal.Footer>
                    {this.state.adding?
                            <Button disabled ><FaPlus/> Adding... </Button>
                            :
                            <Button type="submit" ><FaPlus/> Add </Button>
                       }
                    </Modal.Footer>
                        </div>
                </Form>
                </Modal>


                <br/>


                {/* Search Box and Add Faculty */}
                
                {/* <Navbar sticky="top">
                <Input type="text" value={this.state.Search} onChange={this.handleSearch} placeholder="Search Student name"></Input>
                      <Navbar.Collapse className="justify-content-end" >
                            <Button onClick={this.handleAddModalShow}> <FaPlus/> Add Student</Button>
                      </Navbar.Collapse>
                </Navbar> */}

                <Container>
                  <Row>
                    <Col xs={7} sm={9}>
                    <Input type="text" value={this.state.Search} onChange={this.handleSearch} placeholder="Search class"></Input>
                    </Col>
                    <Col>
                    <Button onClick={this.handleAddModalShow}> <FaPlus/> Add class</Button>
                    </Col>
                  </Row>
                </Container>



                {/* <div style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                     <span style={{ paddingLeft: "10px" }}><Input type="text" value={this.state.Search} onChange={this.handleSearch} placeholder="Search Student name"></Input></span>
                     <span  style={{ paddingLeft: "600px" }}><Button onClick={this.handleAddModalShow}> <FaPlus/> Add Student</Button></span>
                </div>    */}

                <br/>

                {/* Table */}
                <Table responsive bordered striped hover>
                    <thead>
                        <th> id </th>
                        <th> class-Section</th>
                        <th>  Cap   </th>
                        <th>   </th>
                    </thead>
                    <tbody>

                        {
                            this.state.classesData.map(({section,theclass,cap,_id},id) => 
                                <tr key={id}>
                                    <td>{_id}</td>
                                    <td>{theclass}-{section}</td>
                                    <td>{cap}</td>
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

export default ClassesTab;