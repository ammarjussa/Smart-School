const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

// database init, "my project" is the name of the database
const dbName = 'myproject';   
const url = 'mongodb+srv://abdullah_138:mongoDbMA@ssms-01-11gdw.mongodb.net/test?retryWrites=true'

//Add Students Query
module.exports.addStudent = function (account,callback){

    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
            message='Error connecting server'
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        insertDocu(db,account, function() {
            client.close();
        });
    });     
    const insertDocu = function(db, account) {
        // Get the documents collection
        const collection = db.collection('Students');
        
        collection.insertOne(account, function(err, result) {
            if(err) throw err;
            console.log("Inserted Student Successfully");
            callback(result);
        });
    }
}



//Add Faculty Query
module.exports.addFaculty = function (account,callback){

    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        insertDocuments(db,account,()=> {
            client.close();
        });       


    });     
    const insertDocuments = function(db, account) {
        // Get the documents collection
        const collection = db.collection('Faculty');
        
        const saltRounds = 10;
        //hash the password through bcyrpt 
        bcrypt.hash(account.password,saltRounds).then(function (hash) {
            
            account.password = hash;

            collection.insertOne(account, function(err, result) {
                if(err) throw err;
                console.log("Inserted Faculty Successfully");
                callback(result);
            });
        });
    }
}

module.exports.deleteStudent = (name, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        deleteDocument(db, name, ()=> {
            client.close();
        });

    });
    
    const deleteDocument = (db,name)=> {
        const collection = db.collection('Students');
        collection.deleteOne({name: name}, (err, obj)=> {
            if (err) throw err;
            console.log('Student deleted Successfully');
            callback(obj);
        })
    }
}


module.exports.deleteFaculty = (email, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        deleteDocument(db, email, ()=> {
            client.close();
        });

    });
    
    const deleteDocument = (db, email)=> {
        const collection = db.collection('Faculty');
        collection.deleteOne({email: email}, (err, obj)=> {
            if (err) throw err;
            console.log('Faculty deleted successfully');
            callback(obj);

        })
    }
}

//Displaying Students Query
module.exports.displayStudents= (callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        findStudent(db);

        client.close();
        
    }); 

    var findStudent = (db) => {
        const collection = db.collection('Students')
        collection.find({}).toArray((err,items) => {
            if (err) throw err;
            callback(items);
        });
    }
}


//Displaying Faculty Query
module.exports.displayFaculty= (callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        findFaculty(db);

        client.close();
        
    }); 

    var findFaculty = (db) => {
        const collection = db.collection('Faculty');
        collection.find({}).toArray((err,items) => {
            if (err) throw err;
            callback(items);
        });
    }
}

//Validating Admin Query
module.exports.validAdmin = function(account ,callback){
    
    var status = "undefined";

    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        authUser(db,account.email, account.password);

        client.close();
        
    }); 
    
    var authUser = function(db, email, password){
       
        // Get the documents collection
        const collection = db.collection('Admins');
        
        collection.findOne({"email":email},(err,items)=>{
            
            if(items == null){
                status = "Invalid email or password";
            }
            else if(!bcrypt.compareSync(password, items["password"])){
                status = "invalid email or password!";
            }
            else{
                status = "success";
            }

            callback(status);
        });
    }
}


//Validating Faculty Query
module.exports.validFaculty = function(account,callback){
    
    var status = "undefined";

    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        authUser(db,account);

        client.close();
        
    }); 
    
    var authUser = function(db, account){
       
        // Get the documents collection
        const collection = db.collection('Faculty');
        
        collection.findOne({"email":account.email},(err,items)=>{
            
            if(items == null){
                status = " does not exists!";
            }
            else if(!bcrypt.compareSync(account["password"], items["password"])){
                status = "invalid password!";
                console.log('Invalid Credentials')
            }
            else{
                status = "success";
                console.log('Sucessful Login');
            }

            callback(status);
        });
    }
}