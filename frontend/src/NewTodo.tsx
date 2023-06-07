import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, useNavigate } from "react-router-dom";
import { create } from "zustand";

const useCreateTodo = create(() => ({
  todo: "",
}));

const API_BASE = "http://localhost:3000";
type Todo = {
  _id: string;
  complete: boolean;
  text: string;
  timestamp: string;
};
function useAddTodo() {
  return useMutation<Todo, unknown, { text: string; complete?: boolean }>(
    (todo) => {
      return fetch(API_BASE + "/todo/new", {
        method: "post",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(todo),
      }).then((res) => res.json());
    }
  );
}
export function NewTodo() {
  const addTodo = useAddTodo();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const todo = useCreateTodo((state) => state.todo);
  const handleAddTodo = async () => {
    // console.log(todo)
    addTodo.mutate(
      { text: todo, complete: false },
      {
        async onSuccess() {
          // invalidate, refetch todos
          await queryClient.refetchQueries({
            queryKey: ["todos"],
          });

          useCreateTodo.setState({ todo: "" });
          navigate("/");
        },
      }
    );
  };
  return (
    <div className="bg-slate-900 relative text-white max-h-full min-h-[90vh]">
      <div className="bg-slate-500 rounded-xl absolute md:top-[40%] md:w-[50%] md:right-[25%] top-[40%] w-[70%] right-[15%] ease-in duration-300">
        <div className="relative px-10 py-5">
          <div className="absolute right-2 transition-all bg-red-500 w-8 h-8 leading-8 text-center rounded-full cursor-pointer">
            X
          </div>
          <Form method="post" onSubmit={handleAddTodo}>
            <h2 className="my-5">add task</h2>
            <input
              type="text"
              onChange={(e) => useCreateTodo.setState({ todo: e.target.value })}
              value={todo}
              className="text-black w-full py-2 rounded-xl px-4"
            />
            <div
              className="bg-slate-600 w-20 rounded-lg py-2 mx-auto flex justify-center my-3 text-center cursor-pointer"
              onClick={handleAddTodo}
            >
              Add
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
