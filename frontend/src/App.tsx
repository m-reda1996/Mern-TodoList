import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

const API_BASE = "http://localhost:3000"

type Todo = { _id: string; text: string; complete: boolean; timestamp: string }

function useTodos() {
  return useQuery<Todo[]>(["todos"], () => fetch(API_BASE + "/todos").then(res => res.json()))
}

function useDeleteTodo() {
  return useMutation<Todo, unknown, string>(id => {
    return fetch(API_BASE + "/todo/delete/" + id, { method: "DELETE" }).then(res => res.json())
  })
}

function useMarkTodoAsComplete() {
  return useMutation<Todo, unknown, string>(id => fetch(API_BASE + "/todo/complete/" + id).then(res => res.json()))
}

function useAddTodo() {
  return useMutation<Todo, unknown, { text: string; complete?: boolean }>(todo => {
    return fetch(API_BASE + "/todo/new", {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(todo),
    }).then(res => res.json())
  })
}

export function App() {
  const queryClient = useQueryClient()
  const todos = useTodos()
  const deleteTodo = useDeleteTodo()
  const markTodoAsComplete = useMarkTodoAsComplete()
  const addTodo = useAddTodo()

  const [popupActive, setPopupActive] = useState(false)
  const [newTodo, setNewTodo] = useState("")

  const handleConfirmMarkAsComplete = async (id: string) => {
    markTodoAsComplete.mutate(id, {
      onSuccess(data) {
        queryClient.setQueryData<Todo[]>(["todos"], todos =>
          todos?.map(todo => {
            if (todo._id === data._id) {
              todo.complete = data.complete
            }
            return todo
          }),
        )
      },
    })
  }

  const handleConfirmDelete = async (id: string) => {
    deleteTodo.mutate(id, {
      onSuccess() {
        queryClient.setQueryData<Todo[]>(["todos"], todos => todos?.filter(todo => todo._id !== id))
      },
    })
  }

  const handleConfirmAdd = async () => {
    addTodo.mutate(
      { text: newTodo, complete: false },
      {
        onSuccess() {
          todos.refetch()
        },
      },
    )

    setPopupActive(false)
    setNewTodo("")
  }

  return (
    <div className="bg-slate-900 flex-1 max-h-full min-h-screen text-white text-center">
      <h1 className="p-3 text-2xl font-semibold">Welcome Mahmoud</h1>
      <h2 className="my-3 text-2xl ">Your Task </h2>
      {todos.isLoading && <h3 className="text-xl font-bold">Loading</h3>}
      {todos.data?.length === 0 && <h3 className="text-xl font-bold">you not have any task</h3>}
      {todos.data?.map(todo => (
        <div
          className={`flex flex-row gap-2 bg-slate-600 rounded-lg py-4 px-9 mx-3 sm:mx-[10%] md:mx-[15%] lg:mx-[20%] relative items-center mb-2 cursor-pointer ${
            todo.complete === false ? "" : "line-through"
          }`}
          key={todo._id}
          onClick={() => handleConfirmMarkAsComplete(todo._id)}
        >
          <div className={`w-4 h-4 border-[3px] border-slate-400 rounded-lg mr-4 ${todo.complete === false ? "bg-white" : "bg-black"}`}></div>
          <div>{todo.text}</div>
          <div
            className="absolute right-4 bg-red-600 py-1 px-3 rounded-full cursor-pointer"
            onClick={event => {
              event.stopPropagation()
              handleConfirmDelete(todo._id)
            }}
          >
            X
          </div>
        </div>
      ))}
      <div className="py-3  px-5 rounded-full bg-blue-400 fixed bottom-7 right-7 cursor-pointer" onClick={() => setPopupActive(true)}>
        +
      </div>
      {popupActive ? (
        <div className="bg-slate-500 rounded-xl fixed md:top-[40%] md:w-[50%] md:right-[25%] top-[40%] w-[70%] right-[15%] ease-in duration-300">
          <div className="relative px-10 py-5">
            <div onClick={() => setPopupActive(false)} className="absolute right-2 transition-all bg-red-500 w-8 h-8 leading-8 text-center rounded-full cursor-pointer">
              X
            </div>
            <div>
              <h2 className="my-5">add task</h2>
              <input type="text" name="" id="" onChange={e => setNewTodo(e.target.value)} value={newTodo} className="text-black w-full py-2 rounded-xl" />
              <div className="bg-slate-600 w-20 rounded-lg m-auto my-3 cursor-pointer" onClick={handleConfirmAdd}>
                Add
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
