const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const cors = require('cors')
const path = require('path')
app.use(cors('*'))
app.options('*', cors());
app.use(express.static(path.resolve(__dirname, "./build")));
app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./build", "index.html"));
  });
server.listen(8443,(err,res)=>{
    console.log("err");
})