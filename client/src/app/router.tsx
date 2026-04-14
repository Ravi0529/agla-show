import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";
import VerifyOtpPage from "../features/auth/pages/VerifyOtpPage";
import HomePage from "../features/movie/pages/HomePage";
import ProtectedRoute from "../shared/routes/ProtectedRoute";
import PublicRoute from "../shared/routes/PublicRoute";
import MainLayout from "../shared/layouts/MainLayout";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtpPage />,
      },
    ],
  },
  {
    path: "*",
    element: <div>Page Not Found</div>,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
        ],
      },
    ],
  },
]);
