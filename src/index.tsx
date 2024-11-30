/* Our starting point of the app. */
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container); // Create root for React 18

root.render(<App />);
