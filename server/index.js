import express from "express";
import { createConnection } from "typeorm";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(morgan("dev"));

const PORT = 5000;
createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: process.env.PASSWORD,
  database: "erp",
  synchronize: true,
  dateStrings:true,
  entities: ["./entities/*.ts"],
})
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/admin", adminRoutes);
app.use('/api/faculty',facultyRoutes);
app.use("/api/student", studentRoutes);

app.listen(PORT, () => {
  console.log("server running on port 5000");
});
