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

const ip = 'localhost'

class Faculty extends Component {

    state = {
        facultyData: [],
        facultyDataBackup: [],
        selectAll: false,
        facultyid: '',
        facultyname: '',
        view:{
            id: '',
            isview: false
        },
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
        prevState.view.isview = false
        this.setState(prevState)
    } 

    handleViewModalShow = (ev) =>{
        var prevState = Object.assign({},this.state)
        prevState.view.isview = true
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
            }).catch((e) => console.log(e))

            })
        })

        
    }

    get_faculty(id,cb) {
        let count = 0
        this.state.facultyData.forEach(f => {
            if(f.facultyid===id && count<1)
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

    handleView = () => {

        //this.handleViewModalShow()
        //this.handleViewModalClose()
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

    adding = () =>{
        var prevState = Object.assign({},this.state)
        prevState.adding = true
        this.setState(prevState)
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
                    <Breadcrumb.Item>Admin</Breadcrumb.Item>
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
                    show={this.state.view.isview}
                    onHide={this.handleViewModalClose}
                    size="sm"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Faculty Information</Modal.Title>
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

                                        {this.state.addding? <Button disabled type="submit"><FaPlus/> Adding.. </Button> : <Button type="submit" onClick={this.adding}><FaPlus/> Add </Button>}
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
                <div style={{display: 'flex', "margin": "20px", flex:"1"}}>
                     <span style={{left: "0", }}><Input type="text" value={this.state.Search} onChange={this.handleSearch} placeholder="Search Faculty name"></Input></span>
                     <span  style={{right:"0",}}><Button onClick={this.handleAddModalShow}> <FaPlus/> Add</Button></span>
                </div>   



                {/* Table */}
                <Table responsive hover>
                    <thead>
                        <th><InputGroup.Checkbox checked={this.state.selectAll} onChange={this.handleChangeSelectAll}/></th>
                        <th> id</th>
                        <th> Name</th>
                        <th> Contact </th>
                        <th>     </th>
                    </thead>
                    <tbody>

                        {
                            this.state.facultyData.map(({ facultyid, name,subject,contact},id) => 
                                <tr key={id}>
                                    <td><InputGroup.Prepend><InputGroup.Checkbox checked={this.state.facultyData.check} onChange={this.handleChangeCheckbox}/> </InputGroup.Prepend> </td>
                                    <td>{id}</td>
                                    <td>{name}</td>
                                    <td>{contact}</td>
                                    <td></td>
                                    <td>
                                        {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">View/Edit</Tooltip>}>
                                            <span className="d-inline-block"> */}
                                                <Button variant="success" onClick={this.handleView}> <FaEye/> View/Edit</Button>
                                                <Button variant="danger" onClick={(e) => this.handleDeleteTid(e,facultyid)}> <FaTrashAlt/> Delete</Button>
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