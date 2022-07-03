let addHours = (date,hours) =>{
   
    var endTimeDemo = Date.parse(date)
    var h = new Date(endTimeDemo)
    var w = h.setHours(h.getHours()+hours)
   return new Date(w)
}


module.exports = {addHours}