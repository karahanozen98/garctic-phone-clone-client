import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoomPage from "./pages/Room/index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import { PageWrapper } from "./components/PageWrapper";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PageWrapper isPrivate={true}>
        <HomePage />
      </PageWrapper>
    ),
  },
  {
    path: "/room/:id",
    element: (
      <PageWrapper isPrivate={true}>
        <RoomPage />
      </PageWrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <PageWrapper>
        <LoginPage />
      </PageWrapper>
    ),
  },
  {
    path: "*",
    element: (
      <PageWrapper>
        <NotFound />
      </PageWrapper>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
