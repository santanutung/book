const Razorpay = require('razorpay')
var instance = new Razorpay({
    key_id: 'rzp_test_p10zPLxuzFDmA0',
    key_secret: 'BRSFF4fRocVrS2VKb5inhLZ5',
  });

exports.createOrder=(req, res) => {
    var options = {
        amount:500,
        currency:'INR', 
        'receipt' : "order_receipt"
    };
    instance.orderss.create(options, function(err, order) {
        if(err) {
            return res.status(500).json({
                error:err
            })
        }
        res.json(order)
    })
}