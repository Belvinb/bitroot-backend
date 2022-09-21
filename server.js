const express = require("express");
const app = express();
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
var contactRoutes = require("./routes/contact");

//dotenv
dotenv.config();

//mongoose connection
connectDB();

//body parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())

//root routes
app.use("/", contactRoutes);

//connection port
let PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on ${PORT}`));
