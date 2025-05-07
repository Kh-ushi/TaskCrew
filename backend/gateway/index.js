require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authenticate = require("./src/middleware/auth.middleware");
const multer = require("multer");
const { storage } = require("./src/config/cloud");
const upload = multer({ storage });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const PROJECT_SERVICE_URL = process.env.PROJECT_SERVICE_URL;

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


app.get("/api/users/getUsers", authenticate, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const response = await axios.get(`${USER_SERVICE_URL}/auth/getUsers`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    res.status(response.status).json(response.data.data);
  }
  catch (error) {
    console.log(error);
    res.status(error.response.status).json(error.response.data);
  }
});


app.post("/api/users/addNew", authenticate, upload.single("projectImage"), async (req, res) => {
  try {
    console.log("I am being called");
    console.log(req.user);

    const {
      title,
      description,
      startDate,
      deadline,
      priority,
      teamMembers,
    } = req.body;

    const image = req.file ? req.file.path : process.env.DEFAULT_IMG

    const parsedMembers = JSON.parse(teamMembers);
    console.log(parsedMembers);

    const forwardData = {
      title,
      description,
      startDate,
      deadline,
      priority,
      teamMembers: parsedMembers,
      image
    };

    console.log(forwardData);
    const token = req.headers.authorization?.split(" ")[1];

    const response = await axios.post(`${PROJECT_SERVICE_URL}/project/addNew`, forwardData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.status(response.status).json({ message: response.data.message });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong on server!" });
  }
});


app.get('/api/gateway/getProjectInfo', authenticate, async (req, res) => {

  try {
    const token = req.headers.authorization?.split(" ")[1];

    const projectIds = await axios.get(`${USER_SERVICE_URL}/auth/getProjectIds`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const joinedProjects = projectIds.data.joinedProjects;
    console.log(joinedProjects);

    if (!joinedProjects?.length) {
      return res.status(201).json({ projects: [] });
    }

    const projects = await axios.post(`${PROJECT_SERVICE_URL}/project/getProjects`, joinedProjects, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const allProjects = projects.data.allProjects
    res.status(201).json({ allProjects });

  }
  catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({
        message: err.response.data || 'Error from user service'
      });
    }
    res.status(500).json({ message: 'Internal Server Error' });

  }

});


app.get('/api/gateway/getProjectDetails/:id', authenticate, async (req, res) => {

  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    const response = await axios.get(`${PROJECT_SERVICE_URL}/project/getProjectDetail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.status(201).json({ details: response.data.details });

  }
  catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({
        message: err.response.data || 'Error from user service'
      });
    }
    res.status(500).json({ message: 'Internal Server Error' });


  }

});


app.get('/gateway/getProjectMembers/:id', authenticate, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { id } = req.params;

    const membersResponse = await axios.get(`${PROJECT_SERVICE_URL}/project/getMemberIds/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const members = membersResponse.data;
    console.log(members);


    const memberInfo = await axios.post(`${USER_SERVICE_URL}/auth/getMembersInfo`, { members }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.status(201).json(memberInfo.data.users);

  } catch (error) {
    console.error(error?.response?.data?.error || error.message || error);
    res.status(500).json({ error: "Unable to fetch project members" });
  }
});


app.post('/gateway/addTask/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    const taskInfo = req.body;

    const response = await axios.post(`${PROJECT_SERVICE_URL}/project/addTask/${id}`, taskInfo, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log(response);

     res.status(response.status).json(response.data);

  } catch (error) {
    console.log(error);
    if (error.response) {
      res.status(500).json({error:error.response.data.message || "Something went wrong"});
    } else {
      res.status(500).json({error:"Internal server error"});
    }
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