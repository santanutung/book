const express=require('express');
const app=express();
app.use(express.json());
const userRouter=require('./routes/user');

app.use('/user', userRouter);

const port=process.env.PORT || 3000
app.listen(port,()=>console.log(`Listening port ${port}`))