const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();
const path = require("path");

//route import
const authRoute = require("./routes/authRoute");
const externalRoute = require("./routes/externalRoute");
const itemRoute = require("./routes/itemRoute");
const cityRoute = require("./routes/cityRoute");
const commentRoute = require("./routes/commentRoute");

//options
const app = express();
const port = 3001;

//middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "public")));

//connect mongoDB
mongoose
  .connect(process.env.DATABASE_ONLINE)
  .then(() => {
    app.listen(port, () => {
      console.log("DB Connected");
    });
  })
  .catch((err) => console.log(err));

//home
app.get("/", (req, res) => {
  res.json({ work: true });
});

app.use("/auth", authRoute);
app.use("/item", itemRoute);
app.use("/city", cityRoute);
app.use("/comment", commentRoute);
app.use(externalRoute); //for upload media
