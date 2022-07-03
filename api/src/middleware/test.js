const logger = require('../model/loggerModel');

module.exports = async (req,res,next) =>{
    try {
       
        if(req.method == 'GET'){
            next()
        }
       else if(req.method == 'POST'){
             console.log("re",req);         
        }
       else if(req.method == 'PUT'){
        console.log("kjhgfd");      
        }
       else if(req.method == 'delete'){
        console.log("kjhgfd");          
        }
        else{
            next()
        }
    } catch (error) {
        res.json({error:error})
    }
}