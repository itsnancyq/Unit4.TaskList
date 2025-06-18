import app from "#app";
import db from "#db/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyToken } from "#auth";
import { newUserCheck } from "#auth";


const PORT = process.env.PORT ?? 3000;

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

app.get("/protected", verifyToken, (req, res) => {
  res.send(`Hello ${req.user.username}, this is a protected route.`)
});

app.post("/register", newUserCheck, async(req, res, next)=>{
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserResult = await db.query(`INSERT INTO users
      (username, password)
      VALUES ($1, $2)
      RETURNING *;`, [username, hashedPassword]);
    
    const newUser = newUserResult.rows[0];
    if(!newUser)
      return res.status(500).send("Could not register new user");

    const token = jwt.sign({id: newUser.id, username: newUser.username}, process.env.JWT_SECRET);
    res.status(201).json(token);
  }catch(error){
    console.error("Registration error", error);
    res.status(500).send("Server error during registration.");
  }
});

app.post("/login", async(req, res, next)=>{
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  try{
    const result = await db.query(`SELECT *
      FROM users
      WHERE username = $1;`, [username]);
      console.log(result)

    const userInfo = result.rows[0];
    if (!userInfo) {
      return res.status(401).send("Invalid credentials.");
    }

    const passwordMatch = await bcrypt.compare(password, userInfo.password);
    if(!passwordMatch)
      return res.status(401).send("Not authorized");

    const token = jwt.sign({id: userInfo.id, username: userInfo.username}, process.env.JWT_SECRET);
    res.status(201).json({token});
  }catch(error){
    console.error("Login error:", error);
    res.status(500).send("Server error during login.");
  }
});