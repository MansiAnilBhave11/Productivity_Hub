import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { Toaster } from "react-hot-toast"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#ffffff",
          border: "1px solid #e9e9e7",
          borderRadius: "8px",
          color: "#37352f",
          fontSize: "14px",
          fontWeight: "400",
          padding: "12px 16px",
          boxShadow: "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 3px 12px",
        },
        success: {
          iconTheme: {
            primary: "#0f7b0f",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#e03e3e",
            secondary: "#ffffff",
          },
        },
      }}
    />
  </React.StrictMode>,
)
