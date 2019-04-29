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


class Attendence extends Component {
  render() {
    return (
      <div>
        <h1>Attendence</h1>
        <div>
                {/* BreadCrumbs */}
                <Breadcrumb>
                    <Breadcrumb.Item href="/faculty/Dashboard">Admin</Breadcrumb.Item>
                    <Breadcrumb.Item active>Send Results</Breadcrumb.Item>
                </Breadcrumb>
        </div>
      </div>
    );
  }
}

export default Attendence;