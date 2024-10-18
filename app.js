require("dotenv").config();
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
const connectdb = require('./config/mongodb');
const userRoutes = require('./routes/user.routes');
const indexRoutes = require('./routes/index');
const productsRoutes = require('./routes/products.routes');

connectdb();


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get('/',(req,res)=>{
    console.log("running ...");
    res.send("Hello World");
})
app.use('/user',userRoutes);
app.use('/product',productsRoutes);

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});