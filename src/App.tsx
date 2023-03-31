import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AuthInterceptor from "./components/core/AuthInterceptor";
import Notification from "./components/core/Notification";
import Navbar from "./components/Navbar";
import LogIn from "./pages/LoginPage";
import SignUp from "./pages/SignupPage";
import TableManager from "./pages/TableManager";

/**
 *
 * @returns Notification and RouterProvider for the application
 */
function App() {
  /**
   * creating app router
   */
  const AppRouter = createBrowserRouter([
    {
      path: "/",
      element: <AuthInterceptor />,
      children: [
        {
          path: "",
          element: <TableManager />,
        },
        {
          path: "signup",
          element: <SignUp />,
        },
        {
          path: "login",
          element: <LogIn />,
        },
      ],
    },
  ]);
  return (
    <div className="App">
      <Notification />
      <Navbar />
      <h1 className="App__title">Table Manager</h1>
      <RouterProvider router={AppRouter} />
    </div>
  );
}

export default App;
