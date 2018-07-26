var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dBname = "station";

function DB(){};

module.exports = DB; 

DB.createDB = () =>{
    finalURL = url + dBname;
    mongoClient.connect(finalURL, (err, db)=>{
        if(err) throw err;
        console.log("Database created!");
        db.close();
    });
}

DB.createCollection = (name) => {
    mongoClient.connect(url, (err, db)=>{
        if(err) throw err;
        var dbo = db.db("station");
        dbo.createCollection(name, (err, res) => {
            if(err) throw err;
            console.log("Collection created!");
            db.close();
        })
    });
}

createDB();
createCollection("accounts");

