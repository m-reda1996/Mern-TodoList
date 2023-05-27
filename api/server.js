const experss = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = experss();

app.use(experss.json());

app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/TodoList")
  .then(() => console.log("connected to db"))
  .catch(() => console.error);

const Todo = require("./models/todo");

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();

  res.json(todos);
});

app.post("/todo/new", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  await todo.save();
  res.json(todo);
});

app.delete("/todo/delete/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Todo.findByIdAndDelete(id);

  res.json(result);
});

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


app.listen(3000, () => console.log("started"));
