import db from "#db/client";

export async function getTasks(){
    const sql = `
        SELECT *
        FROM tasks;
    `;

    const {rows: tasks} = await db.query(sql);
    return tasks;
}

export async function getTaskById(id){
    const sql = `
        SELECT *
        FROM tasks
        WHERE id = $1;
    `;

    const {rows: task} = await db.query(sql, [id]);
    return task[0];
}

export async function createTask({title, done, user_id}){
    const sql = `
        INSERT INTO tasks (title, done, user_id)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const {rows: task} = await db.query(sql, [title, done, user_id]);
    return task;
}

export async function updateTask({id, title, done, user_id}){
    const sql = `
        UPDATE tasks
        SET title = $1, done = $2, user_id = $3
        WHERE id = $4
        RETURNING *;
    `;

    const {rows: task} = await db.query(sql, [title, done, user_id, id]);
    return task[0];
}

export async function deleteTask(id){
    const sql = `
        DELETE FROM tasks
        WHERE id =  $1
        RETURNING *;
    `;

    const {rows: task} = await db.query(sql, [id]);
    return task;
}