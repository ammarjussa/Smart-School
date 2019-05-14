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
      edit:{
          id: '',
          isEdit: false
      },
      add_showmodal:false,
      add_studentid: null,
      add_class: '',
      add_classcap: '',
      add_section: '',
      delete_last_deleted: {},
      delete_last_deleted_id: null,
      delete_showmodal: false,
      adding: false,
      Search: ''
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
                name:fObject.name
            }

        axios.post("/deleteclass",del_Obj).then((res) => {
            // var prevState = Object.assign({},this.state)
            // prevState.facultyData = this.state.facultyData.filter((f) => f.studentid !== del_Obj.studentid && f.email !== del_Obj.email)
            // this.setState(prevState)
            var prevState = Object.assign({},this.state)
            let fd = prevState.classesData
            fd = fd.filter((f) => f.name !== fObject.name)
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
    e.preventDefault()
    let obj = this.state
    
        let classInfo = {
            
            section: obj.add_section,
            theclass: obj.add_class,
            cap: obj.add_classcap,
        }

        console.log(classInfo)
        axios.post("/addclass",classInfo).then((res)=>{
            console.log(res.data.message)
            this.setState({add_showmodal:false})
            if(res.data.message === "Success")
            {
                var prevState = Object.assign({},this.state)
                prevState.add_showmodal = false
                prevState.add_class= ''
                prevState.add_classcap= ''
                prevState.add_subject= ''
                let fd = prevState.facultyData
                fd.push(classInfo)
                prevState.facultyData = fd
                this.setState(prevState)
            }
            else{
                alert("Something went Wrong!")
            }


        }).catch((e) => console.log(e))
  }

  handleEdit = () => {

  }

  handleAddInputs = (ev) => {
    ev.preventDefault()
    let {name,value} = ev.target
    console.log(name,value)
    var prevState = Object.assign({},this.state)
    prevState[name] = value
    this.setState(prevState)
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.setState({Search:e.target.value}, ()=>{
        console.log(this.state.Search)
        let tempvalue = this.state.Search 
        this.setState((prevState) => {
                return {classesData: prevState.classesDataBackup.filter((f)=> f.theclass===tempvalue)}
        })
    })
    
    
  }


  render() {
    return (
      <div>
        <h1>Classes Information</h1>
        <div>
                {/* BreadCrumbs */}
                <Breadcrumb>
                    <Breadcrumb.Item href="/admin/Dashboard">Admin</Breadcrumb.Item>
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
                      <Modal.Body>
                        <h4>Work in Progress....</h4>
                      </Modal.Body>
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
                        <Modal.Title>Class Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
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
                            <Row>
                                <Col>
                                    <b>Cap:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.cap}
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleViewModalClose}>Close</Button>
                        <Button variant="danger" disabled onClick={this.handleView}>Edit</Button>
                    </Modal.Footer>
                </Modal>

                {/* Add Faculty */}
                <Modal
                    show={this.state.add_showmodal}
                    size="sm"
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
                                            <Form.Label>Class:</Form.Label>
                                            <Form.Control 
                                             name="add_class"
                                             value={this.state.add_class}
                                             onChange={this.handleAddInputs}
                                            as="select">
                                                <option>Grade...</option>
                                                <option>5</option>
                                                <option>6</option>
                                                <option>7</option>
                                                <option>8</option>
                                                <option>9</option>
                                                <option>10</option>
                                                <option>11</option>
                                                <option>12</option>
                                                <option>13</option>
                                            </Form.Control>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>

                                            <Form.Group as={Col}>
                                            <Form.Label>Section:</Form.Label>
                                            <Form.Control 
                                             name="add_section"
                                             value={this.state.add_section}
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
                                                placeholder="Enter Class Cap"
                                                name="add_classcap"
                                                value={this.state.add_classcap}
                                                onChange={this.handleAddInputs}
                                                />
                                        </Form.Group>
                                           
                                        </Form.Row>

                                        <Button  type="submit" ><FaPlus/> Add </Button>
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
                <Input type="text" value={this.state.Search} onChange={this.handleSearch} placeholder="Search Student name"></Input>
                      <Navbar.Collapse className="justify-content-end" >
                            <Button onClick={this.handleAddModalShow}> <FaPlus/> Add Student</Button>
                      </Navbar.Collapse>
                </Navbar> */}

                <Container>
                  <Row>
                    <Col xs={7} sm={9}>
                    <Input type="text" value={this.state.Search} onChange={this.handleSearch} placeholder="Search Class"></Input>
                    </Col>
                    <Col>
                    <Button onClick={this.handleAddModalShow}> <FaPlus/> Add Class</Button>
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
                        <th><InputGroup.Checkbox checked={this.state.selectAll} onChange={this.handleChangeSelectAll}/></th>
                        <th> id </th>
                        <th> Class</th>
                        <th> Section </th>
                        <th>  Cap   </th>
                        <th>   </th>
                    </thead>
                    <tbody>

                        {
                            this.state.classesData.map(({section,theclass,cap,_id},id) => 
                                <tr key={id}>
                                    <td><InputGroup.Prepend><InputGroup.Checkbox /> </InputGroup.Prepend> </td>
                                    <td>{_id}</td>
                                    <td>{theclass}</td>
                                    <td>{section}</td>
                                    <td>{cap}</td>
                                    <td>
                                        {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">View/Edit</Tooltip>}>
                                            <span className="d-inline-block"> */}
                                                <Button variant="success" onClick={(e) => this.handleView(e,_id)}> <FaEye/> View/Edit</Button>
                                                {/* <Button variant="danger" onClick={(e) => this.handleDeleteTid(e,theclass)}> <FaTrashAlt/> Delete</Button> */}
                                                <Button variant="danger" onClick={(e) => this.handleDeleteModalShow()}> <FaTrashAlt/> Delete</Button>
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