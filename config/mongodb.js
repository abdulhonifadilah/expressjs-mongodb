const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/eduwork';
const client = new MongoClient(url);
(async ()=>{
    try{
        client.connect();
        console.log('database terkoneksi')

    }catch(e){
        console.log(e)
    }
})()

const db = client.db('product');

module.exports= db;