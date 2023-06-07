import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3000";

type Todo = {
  _id: string;
  complete: boolean;
  text: string;
  timestamp: string;
};

function useTodos() {
  return useQuery<Todo[]>(["todos"], () =>
    fetch(API_BASE + "/todos").then((res) => res.json())
  );
}

function useToggleTodo() {
  return useMutation<Todo, unknown, string>((id) =>
    fetch(API_BASE + "/todo/complete/" + id).then((res) => res.json())
  );
}

function useDeleteTodo() {
  return useMutation<Todo, unknown, string>((id) =>
    fetch(API_BASE + "/todo/delete/" + id, { method: "DELETE" }).then((res) =>
      res.json()
    )
  );
}

export function Todos() {
  const todos = useTodos();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();
  const navigate = useNavigate()

  const handleCompleteTodo = async (id: string) => {
    toggleTodo.mutate(id, {
      onSuccess() {
        todos.refetch();
      },
    });
  };
  const handleDeleteTodo = async (id: string) => {
    deleteTodo.mutate(id, {
      onSuccess() {
        todos.refetch();
      },
    });
  };
  return (
    <div className="flex-1  text-center">
      <h1 className="p-3 text-2xl font-semibold">Welcome Mahmoud</h1>
      <h2 className="my-3 text-2xl ">Your Task </h2>
      {todos.data?.length === 0 && (
        <h3 className="text-xl font-bold">you not have any task</h3>
      )}
      {todos.data?.map((todo) => (
        <div
          className={`flex flex-row gap-2 bg-slate-600 rounded-lg py-4 px-9 mx-3 sm:mx-[10%] md:mx-[15%] lg:mx-[20%] relative items-center mb-2 cursor-pointer ${
            todo.complete === false ? "" : "line-through"
          }`}
          key={todo._id}
          onClick={() => navigate(`/todo/${todo._id}`,
          // {
          //   state: {
          //     todoId : todo._id}
          // }
          )}
        >
          <div
            className={`w-4 h-4 border-[3px] border-slate-400 rounded-lg mr-4 ${
              todo.complete === false ? "bg-white" : "bg-black"
            }`}
            onClick={(e) => {
              e.stopPropagation(), handleCompleteTodo(todo._id);
            }}
          ></div>
          <div>{todo.text}</div>
          <div
            className="absolute right-4 bg-red-600 py-1 px-3 rounded-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(), handleDeleteTodo(todo._id);
            }}
          >
            X
          </div>
        </div>
      ))}
    </div>
  );
}
