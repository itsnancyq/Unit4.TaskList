import express from "express";
const router = express.Router();
export default router;

import { getTasks, getTaskById, createTask, updateTask, deleteTask } from "#db/queries/tasks";

router.get("/", async(req, res)=>{
    const tasks = await getTasks();
    return res.send(tasks);
});

router.get("/:id", async(req,res)=>{
    const id = req.params.id;
    if(!Number.isInteger(id) && id < 0){
        return res.status(400).send({error: "Please send a valid task"});
    };

    const task = await getTaskById(id);
    if(!task){
        return res.status(404).send({error: "Task does not exist"});
    };
    res.send(task);
});

router.post("/", async (req, res)=>{
    if(!req.body){
        return res.status(400).send({error: "Missing req.body"});
    };

    const {title, done, user_id} = req.body;
    if(!title || !done || !user_id){
        return res.status(400).send({error: "Missing required params"});
    };

    const task =  await createTask({title, done, user_id});
    res.status(201).send(task);
});

router.put("/:id", async (req, res)=>{
    const id = req.params.id;
    if(!req.body){
        return res.status(400).send({error: "Missing req.body"});
    };

    const {title, done, user_id} = req.body;
    if(!title || !done || !user_id){
        return res.status(404).send({error: "Missing required fields"});
    };

    if(!Number.isInteger(id) && id < 0){
        return res.status(400).send({error: "Please send a valid id"});
    };

    const task = await getTaskById(id);
    if(!task){
        return res.status(404).send({error: "Task does not exist"});
    };

    const updated = await updateTask({title, done, user_id});
    res.status(200).send(updated);
});

router.delete("/", async (req, res)=>{
    const id = req.params.id;
    if(!Number.isInteger(id) && id < 0){
        res.status(400).send({error: "Please send a valid task"});
    };

    const task = await getTaskById(id);
    if(!task){
        return res.status(404).send({error: "Task not found"});
    };

    const deletes = await deleteTask(id);
    if(!deletes){
        res.status(404).send({error: "Task does not exist"});
    };
    res.sendStatus(204);
});