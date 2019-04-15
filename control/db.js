const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

// database init, "my project" is the name of the database
const dbName = 'myproject';   
const url = 'mongodb+srv://abdullah_138:mongoDbMA@ssms-01-11gdw.mongodb.net/test?retryWrites=true'



//Add Students Query
module.exports.addStudent = function (account){

    const message = '';
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
            message='Error connecting server'
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        insertDocuments(db,account, cb, function(message) {
            client.close();
            cb(message);
        });
    });     
    const insertDocuments = function(db, account, callback) {
        // Get the documents collection
        const collection = db.collection('Students');
        
        collection.insertOne(account, function(err, result) {
            if(err) throw err;
            console.log("Inserted 1 document into the collection");
            message="Inserted";
            callback(message);
        });
    }
}


//Add Faculty Query
module.exports.addFaculty = function (account){

    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        insertDocuments(db,account, function() {
            client.close();
        });
    });     
    const insertDocuments = function(db, account, callback) {
        // Get the documents collection
        const collection = db.collection('Faculty');
        
        const saltRounds = 10;
        //hash the password through bcyrpt 
        bcrypt.hash(account.password,saltRounds).then(function (hash) {
            
            account.password = hash;

            collection.insertOne(account, function(err, result) {
                if(err) throw err;
                console.log("Inserted 1 document into the collection");
                callback();
            });
        });
    }
}


//Displaying Students Query
module.exports.displayStudent= (callback) => {
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
        collection.findOne((err,items) => {
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
        const collection = db.collection('Faculty')
        collection.findOne((err,items) => {
            callback(items);
        });
    }
}

//Validating Admin Query
module.exports.validAdmin = function(username, password ,callback){
    
    var status = "undefined";

    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        authUser(db,username, password);

        client.close();
        
    }); 
    
    var authUser = function(db, username, password){
       
        // Get the documents collection
        const collection = db.collection('Admins');
        
        collection.findOne({"username":username},(err,items)=>{
            
            if(items == null){
                status = "Invalid username or password";
            }
            else if(!bcrypt.compareSync(password, items["password"])){
                status = "invalid username or password!";
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