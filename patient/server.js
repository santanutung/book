'use strict'
const express  = require('express');
const app = express()
const cors = require('cors');
const http = require('http');
const path = require('path');
const server = http.createServer(app);



app.use(cors('*'))
app.options('*', cors());



app.use(express.static(path.resolve(__dirname, "./build")));


app.get("*", (req, res) => {

  res.sendFile(path.resolve(__dirname, "./build", "index.html"));
});



app.listen(8446, () => {
  console.log('listening on *:8447');
});

