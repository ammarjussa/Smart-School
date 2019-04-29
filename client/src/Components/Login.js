import React, { Component } from 'react';
import {Route,Switch} from 'react-router'
import Auth from '../auth'
import axios from "axios"
import {Form,Button,Card,Col,Row,Modal,Spinner} from 'react-bootstrap'
import '../App.css'
import LoginNavbar from './LoginNavbar';


class Login extends Component {

  state = {
    email: '',
    password: '',
    showModal: false,
    connectionTimeout: false,
    User: '',
    facultyProfile: null,
    adminProfile: null,
  }


  handleChange = (event) => {
    const {name, value} = event.target
    this.setState({[name]: value});
  }

  sendToServer = (message,event,cb) => {
    event.preventDefault()
    if(this.state.User==="Select User...")
    {
      alert("Invalid Credentials")
          this.setState({
          email: '',
          password: '',
          User: ''
        })
    }
    else{
      console.log("sent", message.email )
      this.setState({showModal: true})
      let resp;
      axios.post("/login", {
        email: message.email,
        password: message.password,
        User: message.User
      }).then((res) => {

          console.log(res.data)
          resp = res.data.success
          let Profile = res.data.Profile
          // console.log(resp)
          this.setState({showModal:false})
          cb(resp,Profile,this.state)
      })
    }
    
    
  }

  handleUser = (ev) => {
    this.setState({User: ev.target.value})
  }

  handleSubmit = (isLogin,profile,st) => {   

    console.log("handlesubmit",isLogin)
    if(isLogin===true)
    {
      if(this.state.User==="Admin")
      {
        this.setState({adminProfile: profile})
        Auth.login(()=>{
          this.props.history.push("/admin")
        })
      }
      else if (this.state.User==="Faculty")
      {
        this.setState({facultyProfile: profile})
        Auth.login(()=>{
          this.props.history.push("/faculty")
        })
      }
    }
    else{
      // if(st.connectionTimeout===true)
      // {
      //   alert("Connection Timeout")
      //   this.setState({
      //   email: '',
      //   password: ''
      // })
      // }
      // else{
          alert("Invalid Credentials")
          this.setState({
          email: '',
          password: '',
          User: ''
        })
      // }
      
    }
    
  }


  render() {
    return ( 
    <div>

      <Modal
        
        size="sm"
        show={this.state.showModal}
        centered
      >
        <Modal.Body className="App">
            <Spinner  animation="grow" variant="primary" />
            <Spinner animation="grow" variant="warning" />
            <Spinner animation="grow" variant="danger" />
        </Modal.Body>
      </Modal>


      <LoginNavbar />
        <div className="center">

          <Card style={{ width: '20rem'}} >
          <div className="App">
            <Card.Header>User Login</Card.Header>
            <Card.Body>
            
            <Form
            onSubmit={(e)=>this.sendToServer(this.state,e,(resp,profile) => this.handleSubmit(resp,profile))}
            >

              <Form.Group as={Col}>
                {/* <Form.Label>User</Form.Label> */}
                <Form.Control 
                name="user"
                onChange={this.handleUser}
                 as="select">
                  <option>Select User...</option>
                  <option value="Admin">Admin</option>
                  <option value="Faculty">Faculty</option>
                </Form.Control>
              </Form.Group>

             <Form.Group as={Col}>
               {/* <Form.Label>email:</Form.Label> */}
               <Form.Control
                required
                type="email"
                name="email"
                placeholder="Enter Email"
                value={this.state.email}
                onChange={this.handleChange}
               />
             </Form.Group >

             <Form.Group as={Col}>
               {/* <Form.Label>Password:</Form.Label> */}
               <Form.Control
                required
                type="password"
                placeholder="Enter Password"
                name="password" 
                value={this.state.password} 
                onChange={this.handleChange}
               />
             </Form.Group>

              <Button variant="outline-primary" type="submit">Login</Button>
          </Form>
          
            </Card.Body>
          </div>
          </Card> 
           
        </div>
    </div>
    );
  }
}

export default Login;
