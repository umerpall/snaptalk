const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { readdirSync } = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(express.json());
//Routes
readdirSync("./routes").map((route) => {
  app.use("/", require("./routes/" + route));
});

//Database
mongoose
  .connect(process.env.DATABASE_URL, {
    dbName: "snaps",
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error in connecting to Database", err);
  });

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
