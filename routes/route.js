var db = require('../control/db.js');

var path = require('path');



module.exports = function(app){

    app.post('/students', (req,res)=>{
        db.displayStudents((items)=> {
            console.log('Displaying Students.....');
            return res.send({students: items});
        })
    });

    app.post('/faculty', (req,res)=>{
        db.displayFaculty((items)=> {
            console.log('Displaying Faculty.....');
            return res.send({faculty: items});
        });
    });

    app.post('/registerStudent', (req,res)=>{
        account = {
            "name":req.body.name,
            "theclass":req.body.theclass,
            "section":req.body.section,
            "pname":req.body.pname,
            "pemail": req.body.pemail,
            "pcontact":req.body.pcontact,
            "gender": req.body.gender
        };
        

        console.log(`${account.name}, ${account.pcontact}`);

        db.addStudent(account,(result) => {
            console.log('Student added');
            return res.send({message: 'Success'});

        });     
        
    });

    app.post('/registerFaculty', (req,res)=>{
        let account = {};
        let myid=0;
        // var theid = updater((id) => {
        //     myid=id;
        // })    
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
        
            db.addFaculty(account,(result)=> {
                console.log('Faculty Added!');
                return res.send({message: 'Success'});
            });
    });

    app.post('/deleteFaculty', (req,res)=> {
        let facId = req.body.facultyid;
        let email = req.body.email;
        console.log(`${facId}, ${email}`)
        db.deleteFaculty(facId, email, (obj)=> {
            console.log(`Deleted Faculty!`);
            return res.send({message: 'Success'});
        })
    })

    app.post('/deleteStudent', (req,res)=> {
        let name = req.body.name;
        console.log(`${name}`)
        db.deleteStudent(name, (obj)=> {
            console.log(`Deleted Student!`);
            return res.send({message: 'Success'});
        })
    })

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
}