const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bookRoutes = require("./Routes/booksroutes");
const memberRoutes = require("./Routes/memberRoutes");

const app = express();
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://rohandudhalkar07:rohan@librarydatabase.su6xl.mongodb.net/?retryWrites=true&w=majority&appName=libraryDatabase"
  )
  .then(() => {
    console.log("database connected");
  });
  
app.use(bookRoutes);
app.use(memberRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
