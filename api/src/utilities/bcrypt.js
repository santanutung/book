//const bcrypt = require("bcrypt")

const saltRounds = 10;
module.exports = {
    hashPassword:(value)=>{
        return new Promise((resolve, reject)=>{
            // bcrypt.hash(value,10,(err,res)=>{
            //   if(err){
            //     reject(err)
            //   }
            //   else{
            //       resolve(res)
            //   }
            // })
            bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(value, salt, function(err, hash) {
                  if(err) {
                    reject(err)
                  }
                  resolve(hash)
              });
          });
        })
    }
}


      
