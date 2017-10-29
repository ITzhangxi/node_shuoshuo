let MongoClient = require('mongodb').MongoClient;
//开启数据库方法
function _connectDB(databaseName,callback){
    let url = 'mongodb://localhost:27017/'+databaseName;
    MongoClient.connect(url,(err,db) => {
        if(err){
            callback(err,null);
            return;
        };
        callback(null,db);
    })
};

//新增数据库
exports.insertOne = function(databaseName,collectionName,json,callback){
//    连接数据库
    _connectDB(databaseName,function(err,db){
        if(err){
            callback(err,null);
            db.close();
            return;
        };
        db.collection(collectionName).insertOne(json,function(err,result){
            if(err){
                callback(err,null);
                db.close();
                return;
            };
            callback(null,result);
            db.close();
        });
    });
};
exports.find = function(databaseName,collectionName,json,C,D){
    let result = [];
    let callback;
    let pageSize;
    let pageNum;
    let sort = {};
    if(arguments.length == 4){
        callback = C;
        pageSize = 0;
        pageNum = 0
    }else if(arguments.length == 5){
        callback = D;
        pageNum = parseInt(C.pageNum) || 0;
        pageSize = parseInt(C.pageSize) || 0;
        sort = C.sort || {};
    }else {
        throw new Error('查询条件必须是3～4个参数');
    };
    let skip = (pageNum - 1) * pageSize;
    let limit = pageSize;

    _connectDB(databaseName,(err,db) => {
        if (err){
            callback(err,null);
            return;
        };
        let cursor = db.collection(collectionName).find(json).skip(skip).limit(limit).sort(sort);
        cursor.each((err,doc) => {
            if(err){
                callback(err,null);
                db.close();
                return;
            };
            if(doc !== null){
                result.push(doc)
            }else {
                callback(null,result);
                db.close();
            }
        })

    })




};