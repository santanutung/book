
const mongoose = require('mongoose');
const permissionsModel = require('../model/permissionsModel');
require('dotenv').config()
const parmissionsModel = require('../model/permissionsModel');
const {add,List} = require('../service/mongoServices')

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

const method_flag={
    GET:'GET',
    POST:'POST',
    DELETE:'DELETE',
    PUT:'PUT'
}

const  all_table =[]



let connect = (options) =>{
    
    // var connectionString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    // var connectionString = `mongodb+srv://sachin:XReivM35vXKLqb5Y@cluster0.oiold.mongodb.net/bookcare?retryWrites=true&w=majority`;
    // var connectionString = `mongodb+srv://rachna:XReivM35vXKLqb5Y@cluster0.dlswm.mongodb.net/bookcare?retryWrites=true&w=majority`;
    //  var connectionString = `mongodb+srv://rachna:XReivM35vXKLqb5Y@cluster0.dlswm.mongodb.net/bookcare?retryWrites=true&w=majority`;
     var connectionString = `mongodb+srv://rachna:XReivM35vXKLqb5Y@cluster0.dlswm.mongodb.net/bookcare?retryWrites=true&w=majority`;
    // var connectionString = `mongodb://localhost:27017/bookcare`;
    // const URL = `mongodb://localhost:27017/bookcare`;
     mongoose.connect(connectionString,options);
     mongoose.connection.on('connected', function () {
       
        console.log(("Mongoose default connection is open to ", connectionString));
    });
    mongoose.connection.on('error', function (err) {
        console.log(("Mongoose default connection has occured " + err + " error"));
    });
        mongoose.connection.on('disconnected', function () {
        console.log(("Mongoose default connection is disconnected"));
    });
}

module.exports =  { connect }

