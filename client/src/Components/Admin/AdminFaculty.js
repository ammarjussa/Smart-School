import React, { Component } from 'react';
import { Route, Switch } from 'react-router'
import auth from '../../auth';
import {Table, InputGroup, Row, Col } from 'react-bootstrap'
import { 
    Card,
    Spinner,
    OverlayTrigger,
    Tooltip,
    Button,
    Container,
    Breadcrumb,
    Modal,
    Form
} from 'react-bootstrap';
import { FaEye,FaTrashAlt,FaPlus} from "react-icons/fa";
import { Input, ModalHeader } from 'semantic-ui-react';
import axios from "axios"

class Faculty extends Component {

    state = {
        facultyData:  [],
        facultyDataBackup: [],
        selectAll: false,
        facultyid: '',
        facultyname: '',
        view_isview:false,
        view_object: {},
        add_showmodal:false,
        add_facultyid: null,
        password1: '',
        password2: '',
        class: '',
        subject: '',
        gender: '',
        name: '',
        contact: '',
        email: '',
        section: '',
        delete_last_deleted: {},
        delete_last_deleted_id: null,
        delete_showmodal: false,
        adding: false,
        Search: '',
        showedit: false
    }


    componentDidMount(){
        //Extract data 
        let resp;
        axios.post("/faculty","ack").then((res) => {
            
            //Make all check false
            this.setState({
                facultyData: res.data.faculty,
                facultyDataBackup : res.data.faculty
            })
        }).catch((e) => {
            console.log("MyError:",e)
        })
        
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
        this.get_faculty(this.state.delete_last_deleted_id, (fObject) => {

            var prevState = Object.assign({},this.state)
            prevState.delete_last_deleted = fObject
            this.setState(prevState, () => {
                let del_Obj = {
                    id : fObject._id
                }
        
            axios.post("/deleteFaculty",del_Obj).then((res) => {
                // var prevState = Object.assign({},this.state)
                // prevState.facultyData = this.state.facultyData.filter((f) => f.facultyid !== del_Obj.facultyid && f.email !== del_Obj.email)
                // this.setState(prevState)
                var prevState = Object.assign({},this.state)
                let fd = prevState.facultyData
                fd = fd.filter((f) => f._id !== fObject._id)
                prevState.facultyData = fd
                prevState.facultyDataBackup = fd
                this.setState(prevState)
                this.handleDeleteModalClose()
            }).catch((e) => alert(e))

            })
        })

        
    }

    get_faculty(id,cb) {
        let count = 0
        this.state.facultyData.forEach(f => {
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
        this.get_faculty(id,(fObject) => {
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

    handleSubmitAddFaculty = (e) => {
        e.preventDefault()
        let obj = this.state
        
        if(obj.password1 === obj.password2)
        {
            
            let facultyInfo = {

                "name": obj.name,
                "contact": obj.contact,
                "gender": obj.gender,
                "email": obj.email,
                "section": obj.section,
                "class": obj.class,
                "password": obj.password1,
                "subject": obj.subject,
            }

            console.log(facultyInfo)
            axios.post("/registerFaculty",facultyInfo).then((res)=>{
                console.log(res.data.message)
                this.setState({adding:false})
                if(res.data.message === "Success")
                {

                    let facultyInfo = {

                        "_id" : res.data.theid,
                        "name": obj.name,
                        "contact": obj.contact,
                        "gender": obj.gender,
                        "email": obj.email,
                        "section": obj.section,
                        "class": obj.class,
                        "password": obj.password1,
                        "subject": obj.subject,
                    }
                    var prevState = Object.assign({},this.state)
                    prevState.add_showmodal = false
                    prevState.password1= ''
                    prevState.password2= ''
                    prevState.class= ''
                    prevState.subject= ''
                    prevState.gender= ''
                    prevState.name= ''
                    prevState.contact= ''
                    prevState.email= ''
                    let fd = prevState.facultyData
                    fd.push(facultyInfo)
                    prevState.facultyData = fd
                    this.setState(prevState)
                }
                else{
                    alert("Something went Wrong!")
                }


            }).catch((e) => console.log(e))
        }else{
            alert("Passwords do not match")
        }
    }

    handleEdit = () => {
        this.setState({showedit: true})
    }

    handleEditUpdate = () => {
        this.setState({updating: true})
        let obj = this.state.view_object
            
            let facultyInfo = {

                "id": obj._id,
                "name": obj.name,
                "contact": obj.contact,
                "gender": obj.gender,
                "email": obj.email,
                "section": obj.section,
                "class": obj.class,
                "subject": obj.subject,
            }

            console.log(facultyInfo)
            axios.post("/updatefaculty",facultyInfo).then((res)=>{
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
                    return {facultyData: prevState.facultyDataBackup.filter((f)=> f.name.toLowerCase().includes(tempvalue.toLowerCase()))}
            })
        })
    }

    render() {
       
        return (
            <div>
                <h1>Faculty Information</h1>
                {/* BreadCrumbs */}
                <Breadcrumb>
                    <Breadcrumb.Item href="/admin/Dashboard">Admin</Breadcrumb.Item>
                    <Breadcrumb.Item active>View Faculty</Breadcrumb.Item>
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
                        <Modal.Title>Edit Faculty Information</Modal.Title>
                        :
                        <Modal.Title>Faculty Information</Modal.Title>}
                    </Modal.Header>
                    <Modal.Body>
                    {this.state.showedit?
                        <Form onSubmit={this.handleSubmitAddFaculty}>
                        <div>
                        <Form.Row>
                            <Form.Group as={Col}>
                            <Form.Label>Name:</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter Name"
                                    name="name"
                                    value={this.state.view_object.name}
                                    onChange={this.handleEditInputs}
                                    />
                                </Form.Group>
                               
                            </Form.Row>

                            <Form.Row>
                            <Form.Group as={Col}>
                            <Form.Label>Gender</Form.Label>
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

                                <Form.Group as={Col}>
                                <Form.Label>Contact</Form.Label>
                                    <Form.Control
                                    name="contact"
                                    value={this.state.view_object.contact}
                                    onChange={this.handleEditInputs}
                                    required
                                    type="tel"
                                    placeholder="Enter Contact"
                                    pattern="^\+92(\s+)?\(?(17|25|29|33|44)\)?(\s+)?[0-9]{3}-?[0-9]{2}-?[0-9]{2}$" 
                                    />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                            <Form.Group as={Col}>
                            <Form.Label>Subject</Form.Label>
                                <Form.Control 
                                 name="subject"
                                 value={this.state.view_object.subject}
                                 onChange={this.handleEditInputs}
                                as="select">
                                    <option>Subject...</option>
                                    <option>English</option>
                                    <option>Urdu</option>
                                    <option>Science</option>
                                    <option>Math</option>
                                </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col}>
                                <Form.Label>Class</Form.Label>
                                <Form.Control
                                 name="class"
                                 value={this.state.view_object.class}
                                 onChange={this.handleEditInputs}
                                 as="select">
                                    <option>Class...</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col}>
                                <Form.Label>Section</Form.Label>
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
                                <Form.Label>Email</Form.Label>
                                    <Form.Control
                                    name="email"
                                    value={this.state.view_object.email}
                                    onChange={this.handleEditInputs}
                                    required
                                    type="email"
                                    placeholder="Enter Email"
                                    />
                                </Form.Group>
                            </Form.Row>
                            </div>
                    </Form>
                    :
                        <Container>
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
                                    <b>Contact:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.contact}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <b>Email:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.email}
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col>
                                    <b>Class:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.class}
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
                                    <b>Subject:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.subject}
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
                        <Modal.Title>Add Faculty</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card>
                            <Card.Body>
                                <Form onSubmit={this.handleSubmitAddFaculty}>
                                    <div>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                        <Form.Label>Name:</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                // placeholder="Enter Name"
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

                                            <Form.Group as={Col}>
                                            <Form.Label>Contact:</Form.Label>
                                                <Form.Control
                                                name="contact"
                                                value={this.state.contact}
                                                onChange={this.handleAddInputs}
                                                required
                                                type="tel"
                                                placeholder="Enter Contact"
                                                pattern="^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$" 
                                                />
                                            <Form.Text className="text-muted">
                                            Format: +92xxxxxxxxxx
                                            </Form.Text>
                                            </Form.Group>
                                        </Form.Row>

                                        <Form.Row>
                                        <Form.Group as={Col}>
                                        <Form.Label>Subject:</Form.Label>
                                            <Form.Control 
                                             name="subject"
                                             value={this.state.subject}
                                             onChange={this.handleAddInputs}
                                            as="select">
                                                <option>Subject...</option>
                                                <option>English</option>
                                                <option>Urdu</option>
                                                <option>Science</option>
                                                <option>Math</option>
                                            </Form.Control>
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                            <Form.Label>Class:</Form.Label>
                                            <Form.Control
                                             name="class"
                                             value={this.state.class}
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
                                            <Form.Label>Email:</Form.Label>
                                                <Form.Control
                                                name="email"
                                                value={this.state.email}
                                                onChange={this.handleAddInputs}
                                                required
                                                type="email"
                                                // placeholder="Enter Email"
                                                />
                                            </Form.Group>
                                        </Form.Row>

                                        <Form.Row>
                                                <Form.Group as={Col}>
                                                <Form.Label>Password:</Form.Label>
                                                    <Form.Control
                                                    required
                                                    type="password"
                                                    // placeholder="Enter Password"
                                                    name="password1"
                                                    value={this.state.password1}
                                                    onChange={this.handleAddInputs}
                                                    />
                                                </Form.Group>
                                                <Form.Group as={Col}>
                                                <Form.Label>Re-type Password:</Form.Label>
                                                    <Form.Control
                                                    required
                                                    type="password"
                                                    // placeholder="Confirm Password"
                                                    name="password2"
                                                    value={this.state.password2}
                                                    onChange={this.handleAddInputs}
                                                    />
                                                </Form.Group>
                                        </Form.Row>

                                        {this.state.adding? <Button disabled type="submit"><FaPlus/> Adding.. </Button> : <Button type="submit" ><FaPlus/> Add </Button>}
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
                <Container>
                  <Row>
                    <Col xs={7} sm={9}>
                    <Input type="text" value={this.state.Search} onChange={this.handleSearch} placeholder="Search Faculty name"></Input>
                    </Col>
                    <Col>
                    <Button onClick={this.handleAddModalShow}> <FaPlus/> Add Faculty</Button>
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
                        <th> Email </th>
                        <th>     </th>
                    </thead>
                    <tbody>

                        {
                            this.state.facultyData.map(({ _id, name,subject,email,contact},id) => 
                                <tr key={id}>
                                    <td><InputGroup.Prepend><InputGroup.Checkbox checked={this.state.facultyData.check} onChange={this.handleChangeCheckbox}/> </InputGroup.Prepend> </td>
                                    <td>{_id}</td>
                                    <td>{name}</td>
                                    <td>{email}</td>
                                    <td>
                                        {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">View/Edit</Tooltip>}>
                                            <span className="d-inline-block"> */}
                                                <Button variant="success" onClick={(e) => this.handleView(e,_id)}> <FaEye/> View/Edit</Button>
                                                <Button variant="danger" onClick={(e) => this.handleDeleteTid(e,_id)}> <FaTrashAlt/> Delete</Button>
                                            {/* </span>
                                            </OverlayTrigger> */}
                                    </td>
                                    
                                </tr>
                            )

                        }

                    </tbody>
                </Table>

                {this.state.facultyData.length===0 ? <p>No records available</p> : <p></p>}
            </div>
        );
    }
}

export default Faculty;