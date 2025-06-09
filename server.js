import app from "#app";
import db from "#db/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyToken } from "#auth";


const PORT = process.env.PORT ?? 3000;

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});


app.post("/register", async(req, res, next)=>{
  const {username, password} = req.body;
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.query(`INSERT INTO users
      (username, password)
      VALUES ($1, $2)
      RETURNING *;`, [username, hashedPassword]);

    if(!newUser)
      return res.status(401).send("Could not register new user");

    const token = jwt.sign({id: newUser.id, username: newUser.username}, process.env.JWT_SECRET);
    res.status(201).json(token);
  }catch(error){
    console.error(error);
    res.status(201).json(token);
  }
});

app.post("/login", async(req, res, next)=>{
  const {username, password} = req.body;
  try{
    const result = await db.query(`SELECT *
      FROM users
      WHERE username = $1;`, [username]);
      console.log(result)
    const userInfo = await result.rows[0];

    const passwordMatch = await bcrypt.compare(password, userInfo.password);
    if(!passwordMatch)
      return res.status(401).send("Not authorized");

    const token = jwt.sign({id: userInfo.id, username: userInfo.username}, process.env.JWT_SECRET);
    res.status(201).json(token);
  }catch(error){
    console.error("Could not login");
  }
});