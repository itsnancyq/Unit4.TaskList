import express from "express";
const router = express.Router();
export default router;

import {getUsers, getUserById, createUser, updateUser, deleteUser} from "#db/queries/users";

router.get("/", async(req, res) => {
    const users = await getUsers();
    return res.send(users);
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    if(isNaN(id) || id < 0){
        return res.status(400).send({error: "Please send a valid user"})
    };

    const user = await getUserById(id);
    if(!user){
        return res.status(404).send({error: "User does not exist."});
    };
    res.send(user);
});

router.post("/", async (req, res)=>{
    if(!req.body){
        return res.status(400).send({error: "Missing req.body"});
    };

    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).send({error: "Missing required params"});
    };

    const user = await createUser({username, password});
    res.status(201).send(user);
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    if(!req.body){
        return res.status(400).send({error: "Missing req.body"});
    };

    const {username, password} = req.body;
    if(!username || !password){
        return res.status(404).send({error: "Missing requires "});
    };

    if(!Number.isInteger(id) && id < 0){
        return res.status(400).send({error: "Please send valid id"});
    };

    const user = await getUserById(id);
    if(!user){
        return res.status(404).send({error: "User does not exist"});
    };

    const updated = await updateUser({id, username, password});
    res.status(200).send(updated);
});

router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(isNaN(id) || id < 0){
        res.status(400).send({error: "Please send a valid user"});
    };

    const user = await getUserById(id);
    if(!user){
        return res.status(404).send({error: "Recipe not found"});
    };

    const deletes = await deleteUser(id);
    if(!deletes){
        res.status(404).send({error: "User does not exist"});
    };
    res.sendStatus(204);
});