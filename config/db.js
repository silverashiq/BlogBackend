const mongoose= require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");

dotenv.config();

const connectDB= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected".bgGreen);   
    } catch (error){
        console.log(error);
    }
};

module.exports = connectDB;
