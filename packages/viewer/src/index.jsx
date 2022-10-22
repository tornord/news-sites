import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { css, Global } from "@emotion/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Global
      styles={css`
        body {
          margin: 0;
        }
      `}
    />
    <App />
  </>
);
