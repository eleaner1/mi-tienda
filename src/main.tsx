import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App";
import { TRPCProvider } from "@/providers/trpc";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";

import "./index.css";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "16px",
            fontFamily: "sans-serif",
            padding: "24px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
            Algo salió mal
          </h2>
          <p style={{ color: "#666", maxWidth: "400px", textAlign: "center" }}>
            {this.state.message || "Error inesperado en la aplicación."}
          </p>
          <button
            style={{
              padding: "8px 20px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => {
              this.setState({ hasError: false, message: "" });
              window.location.href = "/";
            }}
          >
            Volver al inicio
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <TRPCProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TRPCProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
