var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function User(user){
    this.name = user.name;
    this.password = user.password;
};

module.exports = User;
//使用者儲存資訊
User.prototype.save = (user, callback)=>{
    //插入資料
    mongoClient.connect(url, (err, db)=>{
        if(err) throw err;
        var dbo = db.db("station");
        dbo.collection("accounts").insertOne(user, (err, res)=>{
            if(err) throw err;
            console.log("1 document inserted");
            db.close();
            callback(err, user);
        })
    })
};
//讀取用戶資訊
User.get = (name, callback)=>{
    mongoClient.connect(url, (err, db)=>{
        if(err) throw err;
        var dbo = db.db("station");
        dbo.collection("accounts").findOne({
            name: name
        }, (err, result)=>{
            if(err) throw err;
            console.log(result);
            db.close;
            callback(err, result);
        });
    });
}