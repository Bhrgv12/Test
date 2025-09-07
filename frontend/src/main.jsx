import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css"; // global bootstrap
import "./index.css"; // your custom CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>                   {/* <-- only ONE BrowserRouter here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
