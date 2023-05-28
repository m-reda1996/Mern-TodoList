// import { useState } from "react";
import { Link, Outlet } from "react-router-dom";



export function App() {


  return (
    <div className="bg-slate-900 text-white max-h-full min-h-screen">
      <div className="p-3">
        <nav>
          <ul className="flex flex-row gap-3 justify-center">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to={"/new"}>Create</Link>
            </li>
          </ul>
        </nav>
      </div>

      <Outlet />
    </div>
  );
}

