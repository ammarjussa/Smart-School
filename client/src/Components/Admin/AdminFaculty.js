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
import { FaEye,FaTrashAlt,FaPlus, FaSleigh, FaTruckMonster} from "react-icons/fa";
import { Input, ModalHeader } from 'semantic-ui-react';
import axios from "axios"

class Faculty extends Component {

    state = {
        facultyData:  [
            {
                facultyid: 1,
                name: '--',
                subject: '--',
                email: '--',
            },
            {
                facultyid: 1,
                name: '--',
                subject: '--',
                email: '--',
            },
            {
                facultyid: 1,
                name: '--',
                subject: '--',
                email: '--',
            },
            {
                facultyid: 1,
                name: '--',
                subject: '--',
                email: '--',
            },
            {
                facultyid: 1,
                name: '--',
                subject: '--',
                email: '--',
            },
          
         ],
        facultyDataBackup: [],
        selectAll: false,
        facultyid: '',
        facultyname: '',
        view_isview:false,
        view_object: {},
        edit:{
            id: '',
            isEdit: false
        },
        add_facultyid: null,
        add_showmodal:false,
        add_password1: '',
        add_password2: '',
        add_class: '',
        add_subject: '',
        add_gender: '',
        add_name: '',
        add_contact: '',
        add_email: '',
        delete_last_deleted: {},
        delete_last_deleted_id: null,
        delete_showmodal: false,
        adding: false,
        Search: ''
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
                    facultyid:fObject.facultyid,
                    email: fObject.email
                }
        
            axios.post("/deleteFaculty",del_Obj).then((res) => {
                // var prevState = Object.assign({},this.state)
                // prevState.facultyData = this.state.facultyData.filter((f) => f.facultyid !== del_Obj.facultyid && f.email !== del_Obj.email)
                // this.setState(prevState)
                var prevState = Object.assign({},this.state)
                let fd = prevState.facultyData
                fd = fd.filter((f) => f.email !== fObject.email)
                prevState.facultyData = fd
                this.setState(prevState)
                this.handleDeleteModalClose()
            }).catch((e) => alert(e))

            })
        })

        
    }

    get_faculty(id,cb) {
        let count = 0
        this.state.facultyData.forEach(f => {
            if(f.email===id && count<1)
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
        
        if(obj.add_password1 === obj.add_password2)
        {
            let facultyInfo = {

                "facultyid": 1,
                "name": obj.add_name,
                "contact": obj.add_contact,
                "gender": obj.add_gender,
                "email": obj.add_email,
                "section": obj.add_section,
                "class": obj.add_class,
                "password": obj.add_password1,
                "subject": obj.add_subject,
            }

            console.log(facultyInfo)
            axios.post("/registerFaculty",facultyInfo).then((res)=>{
                console.log(res.data.message)
                this.setState({adding:false})
                if(res.data.message === "Success")
                {
                    var prevState = Object.assign({},this.state)
                    prevState.add_showmodal = false
                    prevState.add_password1= ''
                    prevState.add_password2= ''
                    prevState.add_class= ''
                    prevState.add_subject= ''
                    prevState.add_gender= ''
                    prevState.add_name= ''
                    prevState.add_contact= ''
                    prevState.add_email= ''
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

    }

    handleAddInputs = (ev) => {
        ev.preventDefault()
        let {name,value} = ev.target
        console.log(name,value)
        var prevState = Object.assign({},this.state)
        prevState[name] = value
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
                        <Modal.Title>Faculty Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                                    <b>Subject:</b>
                                </Col>
                                <Col>
                                    {this.state.view_object.subject}
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleViewModalClose}>Close</Button>
                        <Button variant="danger" onClick={this.handleView}>Edit</Button>
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
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Enter Name"
                                                name="add_name"
                                                value={this.state.add_name}
                                                onChange={this.handleAddInputs}
                                                />
                                            </Form.Group>
                                           
                                        </Form.Row>

                                        <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Control
                                             required
                                             name="add_gender"
                                             value={this.state.add_gender}
                                             onChange={this.handleAddInputs}
                                             as="select"
                                             >
                                                <option>Gender...</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                            </Form.Control>
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                                <Form.Control
                                                 name="add_contact"
                                                 value={this.state.add_contact}
                                                 onChange={this.handleAddInputs}
                                                required
                                                type="text"
                                                placeholder="Enter Contact"
                                                />
                                            </Form.Group>
                                        </Form.Row>

                                        <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Control 
                                             name="add_subject"
                                             value={this.state.add_subject}
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
                                            <Form.Control
                                             name="add_class"
                                             value={this.state.add_class}
                                             onChange={this.handleAddInputs}
                                             as="select">
                                                <option>Class...</option>
                                                <option>6</option>
                                                <option>7</option>
                                                <option>8</option>
                                            </Form.Control>
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                            <Form.Control 
                                             name="add_section"
                                             value={this.state.add_section}
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
                                                <Form.Control
                                                name="add_email"
                                                value={this.state.add_email}
                                                onChange={this.handleAddInputs}
                                                required
                                                type="email"
                                                placeholder="Enter Email"
                                                />
                                            </Form.Group>
                                        </Form.Row>

                                        <Form.Row>
                                                <Form.Group as={Col}>
                                                    <Form.Control
                                                    required
                                                    type="password"
                                                    placeholder="Enter Password"
                                                    name="add_password1"
                                                    value={this.state.add_password1}
                                                    onChange={this.handleAddInputs}
                                                    />
                                                </Form.Group>
                                                <Form.Group as={Col}>
                                                    <Form.Control
                                                    required
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    name="add_password2"
                                                    value={this.state.add_password2}
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
                            this.state.facultyData.map(({ facultyid, name,subject,email,contact},id) => 
                                <tr key={id}>
                                    <td><InputGroup.Prepend><InputGroup.Checkbox checked={this.state.facultyData.check} onChange={this.handleChangeCheckbox}/> </InputGroup.Prepend> </td>
                                    <td>{id}</td>
                                    <td>{name}</td>
                                    <td>{email}</td>
                                    <td>
                                        {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">View/Edit</Tooltip>}>
                                            <span className="d-inline-block"> */}
                                                <Button variant="success" onClick={(e) => this.handleView(e,email)}> <FaEye/> View/Edit</Button>
                                                <Button variant="danger" onClick={(e) => this.handleDeleteTid(e,email)}> <FaTrashAlt/> Delete</Button>
                                            {/* </span>
                                            </OverlayTrigger> */}
                                    </td>
                                    
                                </tr>
                            )

                        }

                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Faculty;