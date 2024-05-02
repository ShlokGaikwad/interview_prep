const express = require("express");
const connection = require("./config/db");
const cors = require("cors");
const userRouter = require("./routes/user.route");
const employeeRouter = require("./routes/employee.route");

require("dotenv").config();

const app = express();
app.use(express.json(), cors());
app.use("/", userRouter);
app.use("/employee", employeeRouter);

app.get("/", (req, res) => {
  res.json("hello from server");
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("server is running and db is connected");
  } catch (error) {
    console.log(error);
  }
});
