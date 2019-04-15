import React, { Component } from 'react';
import { Button,Navbar,Form,Alert,Card,
Container,Row,Col
} from 'react-bootstrap';
import logo from "./logo.png";


class LoginNavBar extends Component {
	render(){
		return(
			<Navbar bg="light">
  			  <Navbar.Brand href="#home">
			      {/* <img
			        // src= {logo}
			        width="250"
			        height="80"
			        className="d-inline-block align-top"
			        alt="logo"
			      /> */}
			    </Navbar.Brand>
			    {'Smart School Management System'}

			  </Navbar>
		)
	}
}

export default LoginNavBar;