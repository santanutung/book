const mysql=require('mysql');

const pool=mysql.createPool({
    connectionLimit:15,
    password:'',
    user:'root',
    database:'pbcmean',
    host:'127.0.0.1',
    port:'3306'
});
module.exports=pool
