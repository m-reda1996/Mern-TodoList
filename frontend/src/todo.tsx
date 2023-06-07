import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const API_BASE = "http://localhost:3000";

type Todo = {
  _id: string;
  complete: boolean;
  text: string;
  timestamp: string;
};
// function useTodos() {
//   return useQuery<Todo[]>(["todo"], (id) =>
//     fetch(API_BASE + "/todo/" + id).then((res) => res.json())
//   );
// }
export function Todo() {
  const { id } = useParams();

  // const todo = useTodos();
  const {
    data: todo,
  } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => fetch(API_BASE + "/todo/" + id).then((res) => res.json()),
  });
console.log(todo?.complete)

  return (
    <div className="flex-1  text-center">
        <h1 className="p-3 text-2xl font-semibold">Welcome Mahmoud</h1>
      <h2 className="my-3 text-2xl ">Your Task </h2>
      <div className={`flex flex-row gap-2 bg-slate-600 rounded-lg py-4 px-9 mx-3 sm:mx-[10%] md:mx-[15%] lg:mx-[20%] relative items-center mb-2 
      ${  todo?.complete === false ? "" : "line-through"  }`}>{todo?.text}</div>
      <div>{todo?.complete ? "complete" :"uncomplete"}</div>
    </div>
  )
}
