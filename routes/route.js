var db = require('../control/db.js');
const nodeMailer = require('nodemailer');

var path = require('path');

//20110236
module.exports = function(app){

//////////////////SEND EMAIL/////////////////////////////////////////////// 
    app.post('/send-email', function (req, res) {
        var theid = req.body.id;

        var totalsum=230;
        

        db.displaySingleStudent(theid, item => {
            var totalmarks = Number(item.q1) + Number(item.q2) + Number(item.q3)+ Number(item.midterm) + Number(item.final);
            console.log('Received Items!');

             const page = `<!DOCTYPE html>
             <html lang="en">
             <head>
               <title> Student Report Card </title>
               <meta charset="utf-8">
               <meta name="viewport" content="width=device-width, initial-scale=1">
               <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
               <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
               <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
               <style type="text/css">
                     table {border-collapse: collapse;}
                     h2 {text-align: center}
                     .table {float: center}
                     .mydiv {
                         border: 2px solid;
                         padding: 20px; 
                         width: 500px;
                         resize: both;
                         overflow: auto;
                     }
                     tbody >tr:nth-child(odd) {background: #D1D0CE;}
                     #details {font-family:times new roman;}
                     #attendance {float: right;}
                     td {
                       border: 1px solid #726E6D;
                       padding: 15px;
                       text-align:center;
                     }
                     thead{
                       font-weight:bold;
                       text-align:center;
                       background: #625D5D;
                       color:white;
                     }
                     .footer {
                       text-align:right;
                       font-weight:bold;
                     }
                     #title {
                       font-family:times new roman;
                       text-align:center;
                       background: #625D5D;
                       color: white;
                     }
               </style>
             </head>
             <body>
                 <div class="mydiv">
                     <div class="container">
                         <div class="jumbotron" id="title">
                             <h1>Smart school</h1>
                         </div>
                     </div>
                     <div class="container">
                         <div class="jumbotron">
                             <div class="container" id="details">
                                 <h2><b>Student report card</b></h2>
                                 <h3><b>Name: </b> ${item.name} </h3>
                                 <h3><b>Class: </b> ${item.theclass}</h3>
                                 <h3><b>Section: </b> ${item.section}</h3>
                                 <h3><b>Attendance: </b> ${(Number(item.presenceNumber)/50)*100} %</h3>
                             </div>
                             <table class="table">
                                 <thead>
                                   <tr>
                                     <td> Quiz 1<br>( /10) </td>
                                     <td> Quiz 2<br>( /10) </td>
                                     <td> Quiz 3<br>( /10) </td>
                                     <td> Mid-Term<br>( /50) </td>
                                     <td> Final<br>( /100) </td>
                                   </tr>
                                 </thead>
                                 <tbody>
                                   <tr>
                                     <td>${item.q1}</td>
                                     <td>${item.q2}</td>
                                     <td>${item.q3}</td>
                                     <td>${item.midterm}</td>
                                     <td>${item.final}</td>
                                   </tr>
                                 </tbody>
                                 <tfoot>
                                   <tr>
                                     <td colspan="1" class="footer">Total percentage: </td>
                                     <td colspan="5">${totalmarks/totalsum*100}</td>
                                   </tr>
                                   <tr>
                                     <td colspan="1" class="footer">Remarks: </td>
                                     <td colspan="5">Average</td>
                                   </tr>
                                 </tfoot>
                             </table>
                         </div>
                     </div>
                 </div>
             </body>
             </html>`;
    
            let transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'smartschoolteam6@gmail.com',
                    pass: 'ssmsteam6'
                }
            });
            let mailOptions = {
                from: '"The Smart School Team" <smartschoolteam6@gmail.com>', // sender address
                to: item.pemail, // list of receivers
                subject: 'Email from server', // Subject line
                text: 'Welcome', // plain text body
                html: page// html body
            };
        
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                return res.send({message: 'Success'});
                });
        });
    })
        


///////////////////////CLASS FUNCTIONS////////////////////////////////
    
    /*Show Class*/
    app.post('/showclass',(req,res)=> {
        db.showClasses((obj)=> {
            console.log('Classes Shown');
            return res.send({classes: obj});
        })
    });

    /*Add Class*/
    app.post('/addclass', (req,res)=> {
        account = {
            "theclass":req.body.theclass,
            "section": req.body.section,
            "cap":req.body.cap
        }
        console.log(`${account.theclass}, ${account.section}, ${account.cap}`);
        db.addClasses(account, (obj)=> {
            console.log('Class Added');
            return res.send({message: 'Success',theid: obj.ops[0]._id});
        })
    });

    // /*Add Section*/
    // app.post('/addsection', (req,res)=> {
    //    var classes = req.body.theclass;
    //    var section = req.body.section;

    //    db.addSections(classes, section, ()=> {
    //        console.log('Section Added');
    //        return res.send({message: 'Success'});
    //    })
    // });

    /*Delete Class*/
    app.post('/deleteclass', (req,res)=> {
        let id = req.body.id;
        console.log(`${id}`)
        db.deleteClass(id, (obj)=> {
            console.log(`Deleted Class!`);
            return res.send({message: 'Success'});
        })
    })

    /*Update Class */
    app.post('/updateclass',(req,res)=> {
        account = {
            "_id":req.body.id,
            "theclass":req.body.theclass,
            "section": req.body.section,
            "cap":req.body.cap
        }
        console.log(`${account.theclass}, ${account.section}, ${account.cap}`);
        db.updateClasses(account, (obj)=> {
            console.log('Class Updated');
            return res.send({message: 'Success'});
        })
    })




//////////////////STUDENT FUNCTIONS////////////////////////////////////

    /*Show Students*/
    app.post('/students', (req,res)=>{
        db.displayStudents((items)=> {
            console.log('Displaying Students.....');
            return res.send({message: 'Success', students: items});
        })
    });

    /*Register Students*/ 
    app.post('/registerStudent', (req,res)=>{
        account = {
            "name":req.body.name,
            "theclass":req.body.theclass,
            "section":req.body.section,
            "pname":req.body.pname,
            "pemail": req.body.pemail,
            "pcontact":req.body.pcontact,
            "gender": req.body.gender,
            "attendence": false,
            "presenceNumber": 0,
            "q1":0,
            "q2":0,
            "q3":0,
            "midterm":0,
            "final":0,
            "issent":false
        };
        
        console.log(`${account.name}, ${account.pcontact}`);

        db.checkStudent(account.name, account.pemail, (obj)=> {
            if(obj) {
                console.log('Duplicate detected!')
                return res.send({message: 'Unsuccessful'});
            }
            else {
                db.addStudent(account,(result) => {
                console.log('Student added');
                return res.send({message: 'Success', theid: result.ops[0]._id});
            
                });
            }  
        });

           
    });

    /*Update Students */
    app.post('/updatestudent', (req,res)=>{
        account = {
            "_id":req.body.id,
            "name":req.body.name,
            "theclass":req.body.theclass,
            "section":req.body.section,
            "pname":req.body.pname,
            "pemail": req.body.pemail,
            "pcontact":req.body.pcontact,
            "gender": req.body.gender
        };
        
        console.log(`${account.name}, ${account.pcontact}`);

        db.modifyStudent(account,(obj) => {
            console.log('Student updated');
            return res.send({message: 'Success'});
        });             
    });

    /*Delete Students */
    app.post('/deleteStudent', (req,res)=> {
        let name = req.body.name;
        console.log(`${name}`)
        db.deleteStudent(name, (obj)=> {
            console.log(`Deleted Student!`);
            return res.send({message: 'Success'});
        })
    })

    /*Adding Students' Grades */
    app.post('/grade', (req,res)=> {
        theid = req.body.id;
        account = {
            "q1": req.body.q1,
            "q2": req.body.q2,
            "q3": req.body.q3,
            "midterm":req.body.midterm,
            "final":req.body.final
        };

        console.log(`${account.midterm} ${account.final}`);

        db.addGrade(theid,account, ()=> {
            console.log('Grade Uploaded!');
            return res.send({message: 'Success'});
        })
    });

    /*Marking attendence*/
    app.post('/attendence',(req,res)=> {
        theid=req.body.id;
        preorabs=req.body.isPresent
        console.log(`ID: ${theid} to mark who is ${preorabs}`);

        db.addAttendence(theid, preorabs, (result)=> {
            console.log('Attendence Marked');
            return res.send({message: 'Success'});
        } )
        
    })


////////////////////////FACULTY FUNCTION///////////////////////////////////////

    /*Show Faculty*/
    app.post('/faculty', (req,res)=>{
        db.displayFaculty((items)=> {
            console.log('Displaying Faculty.....');
            return res.send({faculty: items});
        });
    });

   /*Register Faculty*/
    app.post('/registerFaculty', (req,res)=>{
        let account = {};
         
        account = {
            "name":req.body.name,
            "password":req.body.password,
            "class":req.body.class,
            "section":req.body.section,
            "email": req.body.email,
            "gender":req.body.gender,
            "contact":req.body.contact,
            "subject":req.body.subject
        };

        console.log(`${account.name}, ${account.contact}`);
    
        db.checkFaculty(account.name, account.email, (obj)=> {
            if(obj) {
                return res.send({message: 'Unsuccessful'});
            }

            else {
                db.addFaculty(account,(result)=> {
                    return res.send({message: 'Success', theid: result.ops[0]._id});
                });  
            }
        });
    });

    /*Update Faculty*/
    app.post('/updatefaculty', (req,res)=>{
        let account = {};
         
        account = {
            "_id":req.body.id,
            "name":req.body.name,
            "class":req.body.class,
            "section":req.body.section,
            "email": req.body.email,
            "gender":req.body.gender,
            "contact":req.body.contact,
            "subject":req.body.subject
        };

        console.log(`${account.name}, ${account.contact}`);
    
        db.modifyFaculty(account,()=> {
            console.log('Faculty Added!');
            return res.send({message: 'Success'});
        });
    });

    /*Delete Faculty*/
    app.post('/deleteFaculty', (req,res)=> {
        let id = req.body.id;
        console.log(`${id}`)
        db.deleteFaculty(id, (obj)=> {
            console.log(`Deleted Faculty!`);
            return res.send({message: 'Success'});
        })
    })

    app.post('/facstu',(req,res) => {
        var email=req.body.email;
        console.log(`${email}`);
        
        db.displaySingleFaculty(email,items => {
            if(items) {
                db.showStudentsToFaculty(items.theclass, items.section, students => {
                    console.log("Displaying faculty's students");
                    // console.log(students);
                    return res.send({message:'Success', students: students});
                })
            }

            else {
                return res.send({message: 'Unsuccessful'});
            }
        })
    });

    
/////////////////////////LOGIN FUNCTION//////////////////////////////////////////////
    app.post('/login', (req,res)=>{
        let account = {};
        account = {
            "User":req.body.User,
            "email":req.body.email,
            "password":req.body.password
        };

        console.log(`User: ${account.User}\nEmail: ${account.email}\nPassword: ${account.password}`)

        if(account.User == 'Admin') {
            db.validAdmin(account, function(m){
                if (m == "success"){
                    req.session.user=account;
                    return res.send({
                        success: true,
                        message: 'Nice'
                    });
                }
                else{
                    return res.send({
                        success:false,
                        message:'Not nice'
                    });
                }
            });
        }

        else if(account.User == "Faculty") {
            db.validFaculty(account,function(m){
                if (m == "success"){
                    req.session.user=account;
                    return res.send({
                        success: true,
                        message: 'Nice'
                    });
                }
                else{
                    return res.send({
                        success:false,
                        message:'Not nice'
                    });    
                }
            });
        }

        else {
            res.send('404 Not Found!');
        }
     
    });



//////////////////////////LOGOUT FUNCTION///////////////////////////////////    
    app.post('/logout', (req, res) => {
        req.session.destroy(function(){
           return res.send('Logged out');
        });
     });
    
}

