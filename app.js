import usersRouter from "./api/usersRoute.js";
import tasksRouter from "./api/tasksRoute.js";
import express from "express";
const app = express();
export default app;

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);
app.route("/").get(async (req, res)=>{
  res.send("Welcome User!")
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
