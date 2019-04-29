const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

// database init, "my project" is the name of the database
const dbName = 'myproject';   
const url = 'mongodb+srv://abdullah_138:mongoDbMA@ssms-01-11gdw.mongodb.net/test?retryWrites=true'


module.exports.addClasses = function (account, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
            message='Error connecting server'
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        addClass(db);

        client.close();
    });

    const addClass= function(db,account) {
        const collection = db.collection('Classes');
        collection.insertOne(account, (err, obj)=>{
            if (err) console.log(err);
            console.log("Adding Class");
            callback(obj);
        });
    };


};

module.exports.showClasses = function (callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
            message='Error connecting server'
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        showClass(db);

        client.close();
    });
    
    const showClass = function(db) {
        const collection = db.collection('Classes');

        collection.find({}).toArray((err, obj)=> {
            if (err) throw err;
            console.log('Showing Class');
            callback(obj);

        });
    };
}

// module.exports.addSections = function(classes, section, callback) {
//     MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
//         if(err){
//             console.log("Unable to connect to the server",err);
//             message='Error connecting server'
//         }
//         console.log("Connect to server successfully.");

//         const db = client.db(dbName); 

//         addSec(db,classes,section,cap);

//         client.close();
//     });

//     const addSec = function(db,classes,section) {
//         const collection = db.collection('Classes');
//         collection.updateOne({theclass: classes}, {$push: {sections: section}}, (err,obj)=> {
//             if (err) throw err;
//             console.log('Adding Section');
//             callback();
//         })
//     }
// }


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

//Modify Student
module.exports.modifyStudent = function (account,callback){

    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
            message='Error connecting server'
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        modifyDocu(db,account, function() {
            client.close();
        });
    });     
    const modifyDocu = function(db, account) {
        // Get the documents collection
        const collection = db.collection('Students');
        
        var newValues = {$set: {name: account.name, theclass: account.theclass, section: account.section, pname: account.pname, pemail: account.pemail, pcontact: account.pcontact, gender:account.gender}};
        collection.UpdateOne({name: account.name}, newValues, function(err, result) {
            if(err) throw err;
            console.log("Updating Student");
            callback();
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

//Modify Faculty
module.exports.modifyFaculty = function (account,callback){

    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
            message='Error connecting server'
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        modifyDocu(db,account, function() {
            client.close();
        });
    });     
    const modifyDocu = function(db, account) {
        // Get the documents collection
        const collection = db.collection('Faculty');
        
        var newValues = {$set: {name: account.name, class: account.class, section: account.section, email: account.email, subject: account.subject, contact: account.contact, gender:account.gender}};
        collection.UpdateOne({name: account.name}, newValues, function(err, result) {
            if(err) throw err;
            console.log("Updating Faculty");
            callback();
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


module.exports.deleteFaculty = (email, cb) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        deleteDocument(db, email);
        
        client.close();

    });
    
    const deleteDocument = (db, email)=> {
        const collection = db.collection('Faculty');
        collection.deleteOne({email: email}, (err, obj)=> {
            if (err) throw err;
            console.log('Faculty deleted successfully');
            cb(obj);
        })
    }
}

module.exports.showStudentsToFaculty = (classy, section,callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");
        console.log(dbName);

        const db = client.db(dbName); 

        showTheStudent(db,classy,section);

        client.close();
        
    });

    var showTheStudent=(db)=>{
        const collection = db.collection('Students');
        collection.find({class: classy, section:section}).toArray((err, items)=> {
            if (err) throw err;
            callback(items);
        });
    }
}

//Displaying Students Query
module.exports.displayStudents= (callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");
        console.log(dbName);

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

module.exports.displaySingleFaculty= (email, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        findSingleFaculty(db);

        client.close();
        
    }); 

    var findSingleFaculty = (db,email) => {
        const collection = db.collection('Faculty');
        collection.findOne({email:email}, (err, items) => {
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