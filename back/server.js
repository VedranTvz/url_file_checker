import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import routes from "./routes.js";
import cookieParser from "cookie-parser";
const FRONT_URL=process.env.FRONT_URL;



const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: FRONT_URL,
  credentials: true
}));

app.use(routes);

app.listen(3000, () => {
  console.log("Server running");
});