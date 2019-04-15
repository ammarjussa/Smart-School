var db = require('../control/db.js');

var path = require('path');

module.exports = function(app){
    
    app.get('/', (req,res)=>{
        res.sendFile(path.resolve(__dirname,'..') + '/public/welcome.html');
      
    });

    app.get('/students',(req,res)=> {
        db.displayStudent((data)=> {
            res.json(data);
        })
    })

    // app.post('/react',(req,res)=> {
    //     const {username, password} =  req.body;
    //     console.log(`${username} and ${password}`);

    //     if(username === 'Ammar' && password === 'nice') {
    //         return res.send({
    //             success: true,
    //             message: 'Sex ho gya'
    //         });
    //     }

    //     else {
    //         return res.send({
    //             success: false,
    //             message: 'Loray lag gye!'
    //         })
    //     }
    // })

    app.get('/admin-dashboard', (req,res)=>{
        res.sendFile(path.resolve(__dirname,'..') + '/public/admin-dashboard.html');
    });

    app.get('/faculty-dashboard', (req,res)=>{
        res.sendFile(path.resolve(__dirname,'..') + '/public/faculty-dashboard.html');
    });

    app.get('/admin-login', (req,res)=>{
        res.sendFile(path.resolve(__dirname,'..') + '/public/admin-login.html');
    });

    app.get('/faculty-login', (req,res)=>{
        res.sendFile(path.resolve(__dirname,'..') + '/public/faculty-login.html');
    });
    
    app.get('/registerStudent', (req,res)=>{
        res.sendFile(path.resolve(__dirname,'..') + '/public/registerStudent.html');
    });

    app.get('/registerFaculty', (req,res)=>{
        res.sendFile(path.resolve(__dirname,'..') + '/public/registerFaculty.html');
    });

    app.post('/registerStudent', (req,res)=>{
        account = {
            "name":req.body.name,
            "class":req.body.class,
            "section":req.body.section,
            "email": req.body.email,
            "phone":req.body.phone
        };
        
        db.addStudent(account);
        
        
    });

    app.post('/registerFaculty', (req,res)=>{
        let account = {};
        account = {
            "name":req.body.name,
            "password":req.body.password,
            "class":req.body.class,
            "section":req.body.section,
            "email": req.body.email,
            "phone":req.body.phone
        };
        
        db.addFaculty(account, message=> {
            return res.send({message: message});
        });
        
    });

    app.post('/admin-login', (req,res)=>{
        const {username, password} =  req.body;
        console.log(`Username: ${username}\nPassword: ${password}`)
        db.validAdmin(username, password, function(m){
            if (m == "success"){
                return res.send({
                    success: true,
                    message: 'Sexy'
                });
            }
            else{
                return res.send({
                    success:false,
                    message:'Not sexy'
                });
            }
        });
    });

    app.post('/faculty-login', (req,res)=>{
        let account = {};
        account = {
            "email":req.body.email,
            "password":req.body.password
        };
        db.validFaculty(account,function(m){
            if (m == "success"){
                return res.send({
                    success: true,
                    message: 'Sexy'
                });
            }
            else{
                return res.send({
                    success:false,
                    message:'Not sexy'
                });    
            }
        });
    });
}