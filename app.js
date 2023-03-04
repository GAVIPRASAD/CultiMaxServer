const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDatabase = require("./db/Database");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
const ErrorHandler = require("./middleware/error");
// const path = require("path");

//Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`error: ${err.message}`);
  console.log(`Shutting down Server due to uncaught Exception`);
});

dotenv.config({
  path: "config/.env",
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})



// cors is used for proxy request without this it will throw error proxy cant be done
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true,limit:"50mb"}));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload({useTempFiles: true}));

//Routes
const products = require("./routes/ProductsRoute");
const user = require("./routes/UserRoute");
const order = require("./routes/OrderRoute");
app.use("/api/v1", products);
app.use("/api/v1", user);
app.use("/api/v1", order);


// app.use(express.static(path.join(__dirname,"./build")));
// app.get("*",(req,res) =>{
//   res.sendFile(path.resolve(__dirname,"./build/index.html"));
// })

//error
app.use(ErrorHandler);

//Database
connectDatabase();

// "/" Route
// app.get("/", (req, res) => {
//   res.send("Hello Gavi Prasad Siddu");
// });

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(
    `Server is listening on the port http://localhost:${process.env.PORT}`
  );
});

//Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Server will be down for ${err.msg}`);
  console.log(`Server will be down due to Unhandled promise rejection `);
  server.close(() => {
    process.exit;
  });
});
