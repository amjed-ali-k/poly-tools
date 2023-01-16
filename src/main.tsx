import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";

document.addEventListener("DOMContentLoaded", () => {
  // This will wait for the window to load, but you could
  // run this function on whatever trigger you want
  invoke("close_splashscreen");
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
