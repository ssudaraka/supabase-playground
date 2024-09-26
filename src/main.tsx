import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Signup from "./Signup.tsx";
import Login from "./Login.tsx";
import Realtime from "./Realtime.tsx";
import Data from "./Data.tsx";
import Profile from "./Profile.tsx";
import ForgotPassword from "./ForgotPassword.tsx";
import ConfirmSignUpToken from "./ConfirmSignUpToken.tsx";
import PasswordlessLogin from "./PasswordlessLogin.tsx";
import UpdatePassword from "./UpdatePassword.tsx";
import ChangeEmail from "./ChangeEmail.tsx";
import VerifyToken from "./VerifyToken.tsx";
import ChangePhone from "./ChangePhone.tsx";
import ConfirmPhoneChange from "./ConfirmPhoneChange.tsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "realtime",
        element: <Realtime />,
      },
      {
        path: "data",
        element: <Data />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "confirm-signup",
        element: <ConfirmSignUpToken />,
      },
      {
        path: "passwordless-login",
        element: <PasswordlessLogin />,
      },
      {
        path: "update-password",
        element: <UpdatePassword />,
      },
      {
        path: "change-email",
        element: <ChangeEmail />,
      },
      {
        path: "verify-token",
        element: <VerifyToken />,
      },
      {
        path: "change-phone",
        element: <ChangePhone />,
      },
      {
        path: "confirm-phone-change",
        element: <ConfirmPhoneChange />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
