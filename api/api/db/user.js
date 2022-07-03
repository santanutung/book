const pool=require('./config')
let user={};

user.all=()=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT * FROM user`, (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}
module.exports=user;