const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postsRouter = require("./routes/postRoutes");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json()); //middleware

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }));

app.use('/api/v1', postsRouter); 

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
