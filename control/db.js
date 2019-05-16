const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');


// database init, "my project" is the name of the database
const dbName = 'myproject';   
const url = 'mongodb+srv://abdullah_138:mongoDbMA@ssms-01-11gdw.mongodb.net/test?retryWrites=true'

/////////////////////////////////CLASS/////////////////////////////////////////////////////////////

/*Add Class*/
module.exports.addClasses = function (account, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
            message='Error connecting server'
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        addClass(db,account, ()=> {
            client.close();
        });

    });

    const addClass= function(db,account) {
        const collection = db.collection('Classes');

        getNextSequenceValueClass(db, "classid", (theid)=> {
            account["_id"]= theid;
            collection.insertOne(account, (err, obj)=>{
                if (err) console.log(err);
                console.log("Adding Class");
                callback(obj);
            });
        });    
    };

    const getNextSequenceValueClass= (db,sequenceName,cb) => {
        db.collection('ClassCounter').findOneAndUpdate(
           {_id: sequenceName },
           {$inc:{sequence_value:1}},
           (err,result)=> {
               console.log(result.value.sequence_value);
               cb(result.value.sequence_value);
           });
    }


};

/*Show Class*/
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


//Delete Class
module.exports.deleteClass = (id, cb) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        deleteTheDocument(db, id);
        
        client.close();

    });
    
    const deleteTheDocument = (db, id)=> {
        const collection = db.collection('Classes');
        collection.deleteOne({_id: id}, (err, obj)=> {
            if (err) throw err;
            console.log('Class deleted successfully');
            cb(obj);
        })
    }
}



// /*Add Sections */
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

/**Modify class */
module.exports.updateClasses = function (account,callback){

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
        const collection = db.collection('Classes');
        
        var newValues = {$set: {theclass: account.theclass, section: account.section, cap: account.cap}};
        collection.updateOne({_id:account._id}, newValues, function(err, result) {
            if(err) throw err;
            console.log("Updating Student");
            callback(result);
        });
    }
}



////////////////////////////////////STUDENTS/////////////////////////////////////////////////////


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

/*Display Single Student*/
module.exports.displaySingleStudent= (id, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        findSingleStudent(db,id);
        client.close();
        
    }); 

    var findSingleStudent = (db,id) => {
        const collection = db.collection('Students');
        collection.findOne({_id:id}, (err, items) => {
            if (err) throw err;
            callback(items);
        });
    }
}

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

        getNextSequenceValueStu(db, "studentid", (theid)=> {
            account["_id"]= theid;
        
            collection.insertOne(account, function(err, result) {
                if(err) throw err;
                console.log("Inserted Student Successfully");
                callback(result);
            });
        });    
    }

    const getNextSequenceValueStu= (db,sequenceName,cb) => {

        db.collection('StuCounter').findOneAndUpdate(
           {_id: sequenceName },
           {$inc:{sequence_value:1}},
           (err,result)=> {
               console.log(result.value.sequence_value);
               cb(result.value.sequence_value);
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

        modifyDocu(db,account);
            
        client.close();
        
    });     
    const modifyDocu = function(db, account) {
        // Get the documents collection
        const collection = db.collection('Students');
        
        var newValues = {$set: {name: account.name, theclass: account.theclass, section: account.section, pname: account.pname, pemail: account.pemail, pcontact: account.pcontact, gender:account.gender}};
        collection.updateOne({_id: account._id}, newValues, function(err, result) {
            if(err) throw err;
            console.log("Updating Student");
            callback(result);
        });
    }
}

//Find Student
module.exports.checkStudent= (name, email, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        findStudent(db, name ,email);
        client.close();
        
    }); 

    var findStudent = (db,name,email) => {
        const collection = db.collection('Students');
        collection.findOne({name:name, pemail:email}, (err, items) => {
            if (err) throw err;
            callback(items);
        });
    }
}

//Delete Student
module.exports.deleteStudent = (id, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        deleteDocument(db, id, ()=> {
            client.close();
        });

    });
    
    const deleteDocument = (db,id)=> {
        const collection = db.collection('Students');
        collection.deleteOne({_id: id}, (err, obj)=> {
            if (err) throw err;
            console.log('Student deleted Successfully');
            callback(obj);
        })
    }
}

//Add Grade
module.exports.addGrade = (theid, account, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
            message='Error connecting server'
        }

        
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        addGrd(db,theid, account);

        client.close();
    });

    const addGrd = (db,theid, account) => {
        const collection = db.collection('Students');
        var thegrades = {$set: {q1: account.q1, q2:account.q2, q3:account.q3, midterm:account.midterm, final:account.final}}
        collection.updateOne({_id:theid}, thegrades, (err, result) => {
            if (err) throw err;
            console.log('Added Grades');
            callback();
        })
        
    }
}

//Add Attendence
module.exports.addAttendence = (theid, pora, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
            message='Error connecting server'
        }
        console.log("Connect to server successfully.");
        var hogya = true;

        const db = client.db(dbName); 

        attend(db,theid,pora, hogya);

        client.close();
    });

    const attend = (db,theid, pora, hogya) => {
        const collection = db.collection('Students');
        themarking = '';
        if(pora === true) {
            themarking = {$set: {attendence: pora}, $inc: {presenceNumber: 0.5}};
            collection.findOne({_id:theid}, (err, items)=> {
                if (err) throw err;
                else if(items.attendence === pora) {
                    hogya=false;   
                }
            })
        }
        
        else {
            themarking = {$set: {attendence: pora}};
        }
        
        if(hogya) {
            collection.updateOne({_id:theid}, themarking, (err, result) => {
                if (err) throw err;
                console.log('Added Attendence');
                callback(result);
            });
        }   
    }
}

///////////////////////////////FACULTY//////////////////////////////////////////////


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

        getNextSequenceValueFac(db, "facultyid", (theid)=> {
            account["_id"]= theid;
            bcrypt.hash(account.password,saltRounds).then(function (hash) {
                
                account.password = hash;
    
                collection.insertOne(account, function(err, result) {
                    if(err) throw err;
                    console.log("Inserted Faculty Successfully");
                    callback(result);
                });
            });
        });

    }

    const getNextSequenceValueFac= (db,sequenceName,cb) => {

        db.collection('FacCounter').findOneAndUpdate(
           {_id: sequenceName },
           {$inc:{sequence_value:1}},
           (err,result)=> {
               console.log(result.value.sequence_value);
               cb(result.value.sequence_value);
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

        modifyDocu(db,account, ()=>  {
            client.close();
        });
    });     
    const modifyDocu = function(db, account) {
        // Get the documents collection
        const collection = db.collection('Faculty');
        
        var newValues = {$set: {name: account.name, class: account.class, section: account.section, email: account.email, subject: account.subject, contact: account.contact, gender:account.gender}};
        collection.updateOne({_id: account._id}, newValues, function(err, result) {
            if(err) throw err;
            console.log("Updating Faculty");
            callback();
        });
    }
}

//Find Faculty
module.exports.checkFaculty= (name, email, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        findStudent(db, name ,email);
        client.close();
        
    }); 

    var findStudent = (db,name,email) => {
        const collection = db.collection('Faculty');
        collection.findOne({name:name, email:email}, (err, items) => {
            if (err) throw err;
            callback(items);
        });
    }
}

//Delete Faculty
module.exports.deleteFaculty = (id, cb) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        deleteDocument(db, id);
        
        client.close();

    });
    
    const deleteDocument = (db, id)=> {
        const collection = db.collection('Faculty');
        collection.deleteOne({_id: id}, (err, obj)=> {
            if (err) throw err;
            console.log('Faculty deleted successfully');
            cb(obj);
        })
    }
}

//Show Students To Faculty
module.exports.showStudentsToFaculty = (classy, section,callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

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

//Display Single Faculty
module.exports.displaySingleFaculty= (email, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err,client)=>{
        if(err){
            console.log("Unable to connect to the server",err);
        }
        console.log("Connect to server successfully.");

        const db = client.db(dbName); 

        findSingleFaculty(db,email);

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

////////////////////////VALIDATION//////////////////////////////////////////

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