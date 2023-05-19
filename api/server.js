// @ts-check
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors())

const Todo = require("./models/todo")

app.get("/todos", async (req, res) => {
  const todos = await Todo.find()
  res.json(todos)
})

app.post("/todo/new", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  })
  await todo.save()
  res.json(todo)
})

app.delete("/todo/delete/:id", async (req, res) => {
  const { id } = req.params
  const result = await Todo.findByIdAndDelete(id)
  res.json(result)
})

app.get("/todo/complete/:id", async (req, res) => {
  const { id } = req.params
  const todo = await Todo.findById(id)
  if (todo) {
    todo.complete = !todo.complete
    await todo.save()
    res.json(todo)
  } else {
    res.json({ error: "Todo not found" })
  }
})

async function main() {
  await mongoose.connect("mongodb+srv://ahmed:TqsRbgWXgKbW1WBM@todo.gwuwgre.mongodb.net/")
  app.listen(3000, () => console.log("http://localhost:3000"))
}

main()
