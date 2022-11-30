import React from "react";
import ReactDOM from "react-dom/client";
import ApolloProvider from "./ApolloProvider";
import { AuthProvider } from "./context/auth";
import { MessageProvider } from './context/message'
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <App />
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);

