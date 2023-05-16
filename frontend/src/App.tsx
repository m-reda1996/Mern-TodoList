import { useEffect, useState } from "react";

const API_BASE = "http://localhost:300";
export function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodo();
  }, []);

  const GetTodo = async () => {
    fetch(API_BASE + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error ", err));
  };
  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/complete/" + id).then((res) =>
      res.json()
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };
  const deleteTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todo/new", {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ text: newTodo }),
    }).then((res) => res.json());
    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("");
  };

  return (
    <div className="bg-slate-900 flex-1 max-h-full min-h-screen text-white text-center">
      <h1 className="p-3 text-2xl font-semibold">Welcome Mahmoud</h1>
      <h2 className="my-3 text-2xl ">Your Task </h2>
      {todos.length === 0 && (
        <h3 className="text-xl font-bold">you not have any task</h3>
      )}
      {todos.map((todo) => (
        <div
          className={`flex flex-row gap-2 bg-slate-600 rounded-lg py-4 px-9 mx-3 sm:mx-[10%] md:mx-[15%] lg:mx-[20%] relative items-center mb-2 cursor-pointer ${
            todo.complete === false ? "" : "line-through"
          }`}
          key={todo._id}
          onClick={() => completeTodo(todo._id)}
        >
          <div
            className={`w-4 h-4 border-[3px] border-slate-400 rounded-lg mr-4 ${
              todo.complete === false ? "bg-white" : "bg-black"
            }`}
          ></div>
          <div>{todo.text}</div>
          <div
            className="absolute right-4 bg-red-600 py-1 px-3 rounded-full cursor-pointer"
            onClick={() => deleteTodo(todo._id)}
          >
            X
          </div>
        </div>
      ))}
      <div
        className="py-3  px-5 rounded-full bg-blue-400 fixed bottom-7 right-7 cursor-pointer"
        onClick={() => setPopupActive(true)}
      >
        +
      </div>
      {popupActive ? (
        <div className="bg-slate-500 rounded-xl fixed md:top-[40%] md:w-[50%] md:right-[25%] top-[40%] w-[70%] right-[15%] ease-in duration-300">
          <div className="relative px-10 py-5">
            <div
              onClick={() => setPopupActive(false)}
              className="absolute right-2 transition-all bg-red-500 w-8 h-8 leading-8 text-center rounded-full cursor-pointer"
            >
              X
            </div>
            <div>
              <h2 className="my-5">add task</h2>
              <input
                type="text"
                name=""
                id=""
                onChange={(e) => setNewTodo(e.target.value)}
                value={newTodo}
                className="text-black w-full py-2 rounded-xl"
              />
              <div
                className="bg-slate-600 w-20 rounded-lg m-auto my-3 cursor-pointer"
                onClick={addTodo}
              >
                Add
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
