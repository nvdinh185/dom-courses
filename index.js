const express = require('express');
const app = express();
const mysql = require('mysql');
app.use(express.json());

const configDB = {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "courses"
};

app.use(express.static(__dirname + "/client"));

app.get('/courses', async function (req, res) {
    try {
        var conn = mysql.createConnection(configDB);
        const listCourses = await new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM courses`, (err, row) => {
                if (err) reject(err);
                resolve(row);
            })
        })
        res.status(200).send(listCourses);
    } catch (err) {
        res.status(500).send(err);
    } finally {
        conn.end();
    }
})

app.get('/courses/:id', async function (req, res) {
    var id = req.params.id;
    try {
        var conn = mysql.createConnection(configDB);
        const courseById = await new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM courses WHERE id = '${id}'`, (err, row) => {
                if (err) reject(err);
                resolve(row);
            })
        })
        res.status(200).send(courseById[0]);
    } catch (err) {
        res.status(500).send(err);
    } finally {
        conn.end();
    }
})

app.post('/courses', async function (req, res) {
    var { id, name, description, coin } = req.body;
    try {
        var conn = mysql.createConnection(configDB);
        await new Promise((resolve, reject) => {
            conn.query(`INSERT INTO courses (id, name, description, coin) VALUES (?, ?, ?, ?)`,
                [id, name, description, coin], (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                })
        })
        res.status(200).send('OK');
    } catch (err) {
        res.status(500).send(err);
    } finally {
        conn.end();
    }
})

app.put('/courses/:id', async function (req, res) {
    var { name, description, coin } = req.body;
    var id = req.params.id;
    try {
        var conn = mysql.createConnection(configDB);
        await new Promise((resolve, reject) => {
            conn.query(`UPDATE courses SET name = ?, description = ?, coin = ? WHERE id = ?`,
                [name, description, coin, id], (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                })
        })
        res.status(200).send('OK');
    } catch (err) {
        res.status(500).send(err);
    } finally {
        conn.end();
    }
})

app.delete('/courses/:id', async function (req, res) {
    var id = req.params.id;
    try {
        var conn = mysql.createConnection(configDB);
        await new Promise((resolve, reject) => {
            conn.query(`DELETE FROM courses WHERE id = ?`,
                [id], (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                })
        })
        res.status(200).send('OK');
    } catch (err) {
        res.status(500).send(err);
    } finally {
        conn.end();
    }
})

app.listen(3000, () => console.log('Server listening on port 3000!'))