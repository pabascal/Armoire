import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //allows us to accept JSON data in the req.body

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  connectDB();  //Calls connectDB to connect to MongoDB when the server starts
  console.log("Server started at http://localhost:" + PORT);
});

//Y3oa2b3mZeF5dni6
