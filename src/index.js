const express = require("express")
require("./db/mongoose")
const Task = require("./models/task")

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())


app.post("/tasks", (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get("/tasks", (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

app.get("/tasks/:id", (req, res) => {
    const _id = req.params.id
    Task.findById(_id).then((task) => {
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.patch("/tasks/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed", "bookmarked"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" })
    }
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

app.listen(port, () => {
    console.log("Server is up on port " + port)
})