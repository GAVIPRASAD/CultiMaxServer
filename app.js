const express = require("express")

const app = express();

app.listen(5000,()=>{
   console.log("Hello world");
})
app.get("/",(req,res)=>{
    res.send("Hello")
})
