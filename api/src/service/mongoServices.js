

let getList = async  (model,query) => {
     var  page = query.page? parseInt(query.page):1;
     var limit = query.limit? parseInt(query.limit):5;

    return new Promise(async(resolve,reject)=>{
      try {
        var data = await model.find();
        var res = await model.find().limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
        resolve({
            data:res,
            page:data.length%res.length
       });
      } catch (error) {
          reject(error)
      }
    });
}

let getAllList = async  (model,query) => {
    var  page = query.page? parseInt(query.page):1;
    var limit = query.limit? parseInt(query.limit):5;
    if(!page && !limit){
        return new Promise(async(resolve,reject)=>{
            try {
              var data = await model.find();
              resolve({
                  data:data,
             });
            } catch (error) {
                reject(error)
            }
          });
    }

    else{

        return new Promise(async(resolve,reject)=>{
          try {
            var data = await model.find();
            var res = await model.find().limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
            resolve({
                data:res,
                page:data.length%res.length
           });
          } catch (error) {
              reject(error)
          }
        });
    }

}



let getListFilter = async  (model,query,filter,select) => {
     var  page = query.page? parseInt(query.page):1;
     var limit = query.limit? parseInt(query.limit):5;

    return new Promise(async(resolve,reject)=>{
      try {
        var data = await model.find();
        var res = await model.find(filter).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1}).select(select)
        resolve({
            data:res,
            page:Math.ceil(data.length%parseInt(limit))
       });
      } catch (error) {
          reject(error)
      }
    });
}


let getListSearch = async  (model,query,filter,select) => {
    var  page = query.page? parseInt(query.page):1;
    var limit = query.limit? parseInt(query.limit):5;

   return new Promise(async(resolve,reject)=>{
     try {
       var query_key = Object.keys(filter);
       var key = query_key[0];
       var data = await model.find();
       var res = await model.find({ key: { $regex: query[key] }}).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1}).select(select)
       resolve({
           data:res,
           page:Math.ceil(data.length%parseInt(limit))
      });
     } catch (error) {
         reject(error)
     }
   });
}


let getSearch = async  (model,filter,query,select,search) => {
    var  page = query.page? parseInt(query.page):1;
    var limit = query.limit? parseInt(query.limit):5;

   return new Promise(async(resolve,reject)=>{
     try {
       
       var data = await model.find(filter); 
       var res = await model.find(search).select(select).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1}).select(select)
       resolve({
           data:res,
           page:data.length%res.length
      });
     } catch (error) {
         reject(error)
     }
   });
}


let getSearch1 = async  (model,filter,query) => {
    var  page = query.page? parseInt(query.page):1;
    var limit = query.limit? parseInt(query.limit):5;

   return new Promise(async(resolve,reject)=>{
     try {
       
       var data = await model.find(filter); 

       var res = await model.find().limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
       //console.log(data.length%res.length)
       resolve({
           data:res,
           page:data.length%res.length
      });
     } catch (error) {
         reject(error)
     }
   });
}





let findOne = async  (model,query) => {
    return new Promise(async(resolve,reject)=>{
       try {
           model.findOne(query,(err,res)=>{
               reject(err);
               resolve(res);
           })
       } catch (error) {
           reject(error)
       }
    })
}
let findById = async  (model,id) => {
    return new Promise(async(resolve,reject)=>{
       try {
           var res = await model.findOne({_id:id});
           resolve(res)
       } catch (error) {
           reject(error)
       }
    })
}



let Search =  async (model,query,filterquery) => {
     var  page = query.page? parseInt(query.page):1;
     var limit = query.limit? parseInt(query.limit):1;
     if(!limit && !page && !filterquery){
         //console.log('1')
         return new Promise(async(resolve,reject)=>{
          try {
            var res = await module.find();
            resolve(res)
          } catch (error) {
              reject(error)
          }
         });
     }
    else if(!limit && !page ){
        //console.log('2')
         return new Promise(async(resolve,reject)=>{
            try {
                var res = await module.find(filterquery);
                 resolve(res)
            } catch (error) {
                reject(error)
            }
         });
     }
    // else if (search){
    //     //console.log('3')
    //     return new Promise(async(resolve,reject)=>{
    //         try {
    //         var data = await model.find();
    //         var res = await model.find({ address: { $regex: search.value }}).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});;
          
    //         resolve({
    //                  data:res,
    //                  page:data.length%res.length
    //             });
    //         } catch (error) {
    //             reject(error)
    //         }
    //     });
    // }
 
   else {
    //console.log('4')
    return new Promise(async(resolve,reject)=>{
        try {
        var data = await model.find();
        //console.log(filterquery,'........::::::::::::')
        var res = await model.find(filterquery).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});;
      
        resolve({
                 data:res,
                 page:data.length%res.length
            });
        } catch (error) {
            reject(error)
        }
    });
   }
}


let add = async (model,data) =>{
  return new Promise(async(resolve,reject)=>{
      try {
        var res = await model.create(data).catch(err => {
            //console.log("Error in Add Function", err);

            reject(err);
        });
        resolve(res);
      } catch (error) {
          reject(error)
      }
  });
}



// soft remove  
let remove = async (model, data) => {
    return new Promise(async(resolve,reject)=>{
    try {
        var res = await model.findOneAndUpdate({ _id: data.id }, { isRemoved: true }).catch(err => {
                    //console.log("Error in Soft Delete in Delete Api");
                     reject(err);
                });
                resolve(res);
    } catch (error) {
        reject(error);
    }
    });
  
}

//permanent Remove data 
let permanentRemove = async (model, id) => {
    return new Promise(async(resolve,reject)=>{
        try {
            var res = await model.findOneAndDelete({ _id: id }).catch(err => {
                //console.log("Error in Soft Delete in Delete Api");
                reject(err);
            });
                    resolve(res);
        } catch (error) {
            reject(error)
        }
    })
}

let edit = async (model,id, data) => {
  return new Promise(async(resolve,reject)=>{
      try {
      var res = await model.findOneAndUpdate({_id:id},data,{upsert:true});
      resolve(res)
        
      } catch (error) {
          reject(error)
      }
  })
}
let Update = async (model,id, data) => {
  return new Promise(async(resolve,reject)=>{
      try {
      
        
          var result = await model.findOneAndUpdate( {_id: id}, {$push: data},{new: true, upsert: true },(err,res)=>{
              if(err){
                  reject(err);
              }
              else{
                  resolve(result)
              }
          })
      } catch (error) {
          reject(error)
      }
  })
}


let filterAndSerachList = async (model,query,filter) => {
    var  page = query.page? parseInt(query.page):1;
    var limit = query.limit? parseInt(query.limit):5;

    if(!query.page && !query.limit){
        return new Promise(async(resolve,reject)=>{
            try {
              var data = await model.find(filter);
              resolve({
                  data:data,
             });
            } catch (error) {
                reject(error)
            }
          });
      
    }
  else{
    return new Promise(async(resolve,reject)=>{
        try {
          var data = await model.find(filter);
          var temp = data.length;
         
          var res = await model.find(filter).limit(limit).skip((parseInt(page)-1) * limit).sort({_id:-1});
          resolve({
              data:res,
              page:data.length%res.length
         });
        } catch (error) {
            reject(error)
        }
      });
  }
}

let List = async (model,filter) =>{
    return new Promise((resolve,reject)=>{
     var res = model.find(filter).catch(err=>{
         reject(err)
     });
     resolve(res)
    })
}


let aggregate = async (model,filter)=>{
    return new Promise((resolve,reject)=>{
        model.aggregate(
            filter
        ).exec( function (err, invites) {
            if (err) {
             reject(err)
            }
            resolve(invites)
          }
        );
    })
}


let listPaginate =(model,query,options)=>{
    return new Promise((resolve,reject)=>{
        console.log(model,options,query)
        model.paginate(query, options,(err,res)=>{
            if(err){
                reject(err)
            }
            resolve(res)
        })
    })
}
let  aggregatePaginate = async (model,aggregate,option) =>{
    return new Promise(async(resolve,reject)=>{
      try {
        var myAggregate = model.aggregate(aggregate);
      var data = await  model.aggregatePaginate(myAggregate, option);
      resolve(data)
      } catch (error) {
          reject(error)
      }
    })
}
module.exports  = {getList,add,remove,edit,permanentRemove,Search,findById,Update,getListFilter,getListSearch,getSearch,
    getSearch1,getAllList,filterAndSerachList,List,aggregate,listPaginate,aggregatePaginate
}