import React from "react";
import ReactDOM from "react-dom/client";
import { App, Contact } from "./App.js";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Error } from "./Error.js";
import { NewTodo } from "./NewTodo.js";

 const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount:false,
      refetchOnWindowFocus: false
    }
  }
 });
 
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement : <Error />,
    children: [
      {
        path: "/",
        element: <Contact />,
      },
      {
        path : '/new',
        element: <NewTodo />
      }
    ],
  },
 
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

