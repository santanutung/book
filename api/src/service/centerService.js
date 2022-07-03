var mongoose = require('mongoose');


exports.findData = () =>{
    return new Promise((resolve,reject)=>{
        mongoose.connection.db.collection('book_appointments').aggregate([
            // const patientfamily = await book_appointmentModel.aggregate([
                {
                    $lookup: {
                      from: 'familymembers',
                      localField: 'patient_familyMemberId',
                      foreignField: '_id',
                      as: 'family'
                    }
                  },
        
                //   {
                //     from: 'familymembers',
                //     localField: 'patient_familyMemberId',
                //     foreignField: '_id',
                //     as: 'demo'
                //   }
                  {
                    $lookup: {
                      from: 'users',
                      localField: 'patient_userId',
                      foreignField: '_id',
                      as: 'users'
                    }
                  },
            {$group : {_id: {patient_userId : "$patient_userId", patient_familyMemberId :'$patient_familyMemberId'}}},
            
        ]).toArray().then(data => {
          if(data){
              resolve(data)
          }
         
          }).catch(error=>{
              reject(error)
          })
    })
}