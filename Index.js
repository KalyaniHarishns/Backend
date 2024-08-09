
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 


const app = express();
const db=require('./db')
db();



app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
  });


 
  
 
  
  


    

