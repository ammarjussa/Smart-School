import React, { Component } from 'react';
import {Route,Switch} from 'react-router'
import Auth from '../auth'
import axios from "axios"
import {Form,Button,Card,Col,Row,Modal,Spinner} from 'react-bootstrap'
import '../App.css'
import LoginNavbar from './LoginNavbar';


class Login extends Component {

  state = {
    username: '',
    password: '',
    showModal: false,
    connectionTimeout: false
  }


  handleChange = (event) => {
    const {name, value} = event.target
    this.setState({[name]: value});
  }

  sendToServer = (message,event,cb) => {
    event.preventDefault()
    console.log("sent", message.username )
    this.setState({showModal: true})
    let resp;
    axios.post("/admin-login", {
      username: message.username,
      password: message.password
    }).then((res) => {

        resp = res.data.success
        console.log(resp)
        this.setState({showModal:false})
        cb(resp,this.state)
    })
    
  }

  handleSubmit = (isLogin,st) => {   

    console.log("handlesubmit",isLogin)
    if(isLogin===true)
    {
      Auth.login(()=>{
        this.props.history.push("/app")
      })
    }
    else{
      // if(st.connectionTimeout===true)
      // {
      //   alert("Connection Timeout")
      //   this.setState({
      //   username: '',
      //   password: ''
      // })
      // }
      // else{
          alert("Invalid Credentials")
          this.setState({
          username: '',
          password: ''
        })
      // }
      
    }
    
  }


  render() {
    return ( 
    <div>

      <Modal
        className="App"
        size="sm"
        centered
        show={this.state.showModal}
      >
        <Modal.Body>
            <Spinner animation="grow" variant="primary" />
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
            onSubmit={(e)=>this.sendToServer(this.state,e,(resp) => this.handleSubmit(resp))}
            >
             <Form.Group as={Col}>
               {/* <Form.Label>Username:</Form.Label> */}
               <Form.Control
                required
                type="text"
                name="username"
                placeholder="Enter Username"
                value={this.state.username}
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

              <Button type="submit">Login</Button>
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
