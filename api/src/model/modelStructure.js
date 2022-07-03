
let user_events =
    {
        collection: "user_events",
        keys: {
            userId:{
                "type": "String",
                "trim": true
              },
              eventId:{
                "type": "String",
                "trim": true
              },
              status:{
                type: Number,
                default: 0
            
             }
           
        }
    }
let user_events1 =
    {
        collection: "user_events1",
        keys: {
            userId:{
                "type": "String",
                "trim": true
              },
              eventId:{
                "type": "String",
                "trim": true
              },
              status:{
                type: Number,
                default: 0
            
             }
           
        }
    }

var demo = [
  user_events,user_events1
]

module.exports = demo