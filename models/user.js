var mongodb = require('./db');

function User(user){
    this.name = user.name;
    this.password = user.password;
};

module.exports = User;
//使用者儲存資訊
User.prototype.save = (callback)=>{
    var user = {
        name: this.name,
        password: this.password
    };
    //開啟資料庫
    mongodb.open((err, db)=>{
        if(err){
            mongodb.close();
            return callback(err);
        }
        //用戶資料插入users集合
        collection.insert(user, {
            safe: true
        },(err, user)=>{
            mongodb.close();
            if(err) {
                return callback(err);
            }
            //成功! 回傳err = null
            callback(null, user[0]);
        });
    });
};
//讀取用戶資訊
User.get = (name, callback)=>{
    mongodb.open((err, db)=>{
        if(err) return callback(err);
        //讀取用戶集合
        db.collection('user', (err, collection)=>{
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查詢用戶名
            collection.findOne({
                name: name
            }, (err, user)=>{
                mongodb.close();
                if(err){
                    return callback(err);
                }
                //成功! 傳回用戶資訊
                callback(null, user);
            });
        });
    });
}