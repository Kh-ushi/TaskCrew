require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authenticate = require("./src/middleware/auth.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

app.post("/api/users/signUp", async (req, res) => {

  try {
    const userData = req.body;
    console.log(userData);
    const response = await axios.post(`${USER_SERVICE_URL}/auth/signUp`, userData);
    console.log(response);
    return res.status(response.status).json(response.data);

  }
  catch (error) {
    console.log(error);
    return res.status(error.response.status).json(error.response.data);
  }
});

app.post("/api/users/login", async (req, res) => {

  try {
    const userData = req.body;
    console.log(userData);
    const response = await axios.post(`${USER_SERVICE_URL}/auth/login`, userData);
    console.log(response.data);
    res.status(response.status).json(response.data);
  }
  catch (error) {
    console.log(error);
    res.status(error.response.status).json(error.response.data);
  }

});

app.post("/api/users/addNew", authenticate, async (req, res) => {
  try {
    console.log("I am being called");
    console.log(req.body);
    console.log(req.user);

    res.status(201).json({ message: "User added successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong on server!" });
  }
});


connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`✅ Gateway Running on Port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ Database Connection Failed:", error);
    process.exit(1);
  });