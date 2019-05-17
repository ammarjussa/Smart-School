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
import { FaEye,FaTrashAlt,FaPlus,FaArrowRight, FaCheck} from "react-icons/fa";
import { Input, ModalHeader } from 'semantic-ui-react';
import axios from "axios"


const renderTooltip = props => (
  <div
    {...props}
    style={{
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      padding: '2px 10px',
      color: 'white',
      borderRadius: 3,
      ...props.style,
    }}
  >
    Send Again? Click Here!
  </div>
);


class ResultsTab extends Component {

  state = {
    studentData: [],
    studentDataBackup: [],
    selectAll: false,
    view_isview: false,
    view_object: {},
    edit:{
        id: '',
        isEdit: false
    },
    add_showmodal:false,
    add_studentid: null,
    add_class: '',
    add_section: '',
    add_gender: '',
    add_name: '',
    add_pname: '',
    add_pcontact: '',
    add_pemail: '',
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


updateIsSent = (students,studentsbacku,id) => {
    students.forEach((student) => {
        if(student._id===id)
        {
          student.issent=true
          this.setState({
            studentData: students,
            studentDataBackup: students
          })
        }
    })
}


handleSendResult(e,id,name) {
  console.log(id)
  axios.post("/send-email",{id}).then((res) => {
        
    // Make all check false
     this.updateIsSent(this.state.studentData,this.state.studentDataBackup,id)
}).catch((e) => console.log(e))
}



  render() {
    return (
      <div>
        <h1>Results Information</h1>
        <div>
                {/* BreadCrumbs */}
                <Breadcrumb>
                    {/* <Breadcrumb.Item href="/admin/Dashboard">Admin</Breadcrumb.Item> */}
                    <Breadcrumb.Item>Admin</Breadcrumb.Item>
                    <Breadcrumb.Item active>Send Results</Breadcrumb.Item>
                </Breadcrumb>

                <br/>
  
                {/* Table */}
                <Table responsive bordered striped hover>
                    <thead>
                        {/* <th><InputGroup.Checkbox checked={this.state.selectAll} onChange={this.handleChangeSelectAll}/></th> */}
                        <th> id</th>
                        <th> Name</th>
                        <th> Class-Section </th>
                        <th> Email </th>
                        <th>     </th>
                    </thead>
                    <tbody>

                        {
                            this.state.studentData.map(({section,theclass,name,pemail,_id,issent},id) => 
                                <tr key={id}>
                                    {/* <td><InputGroup.Prepend><InputGroup.Checkbox /> </InputGroup.Prepend> </td> */}
                                    <td>{_id}</td>
                                    <td>{name}</td>
                                    <td>{`${theclass}-${section}`}</td>
                                    <td>{pemail}</td>
                                    <td>
                                      {
                                        issent?
                                        <OverlayTrigger
                                        placement="left-end"
                                        delay={{show:250, hide:100}}
                                        overlay={renderTooltip}
                                        >

                                          <Button variant="success" onClick={(e) => this.handleSendResult(e,_id,name)}> <FaCheck/> Sent  </Button>
                                        </OverlayTrigger>


                                        :
                                    
                                        <Button variant="secondary" onClick={(e) => this.handleSendResult(e,_id,name)}>  Send <FaArrowRight/> </Button>
                                    }
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

export default ResultsTab;