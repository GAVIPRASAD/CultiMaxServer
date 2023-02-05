const express = require("express")
const dotenv = require("dotenv");
const connectDatabase = require("./db/Database");
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const app = express();

//Handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`error: ${err.message}`)
    console.log(`Shutting down Server due to uncaught Exception`)
})

dotenv.config({
    path:"config/.env"
})
app.use(express.json())
app.use(cookieParser())


//Routes
const products = require("./routes/ProductsRoute");
const user = require("./routes/UserRoute");
const order = require("./routes/OrderRoute");
app.use("/api/v1",products);
app.use("/api/v1",user);
app.use("/api/v1",order);


//error
app.use(ErrorHandler);



//Database
connectDatabase();

// "/" Route
app.get("/",(req,res)=>{
    res.send("Hello Gavi Prasad Siddu")
})

const server = app.listen(process.env.PORT,()=>{
   console.log(`Server is listening on the port http://localhost:${process.env.PORT}`);
})




//Unhandled promise rejection
process.on('unhandledRejection',(err)=>{
    console.log(`Server will be down for ${err.msg}`);
    console.log(`Server will be down due to Unhandled promise rejection `);
    server.close(()=>{
        process.exit
    })
})