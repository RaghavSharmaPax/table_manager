import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthInterceptor from "../../components/core/AuthInterceptor";
import LogIn from "../../pages/LoginPage";
import SignUp from "../../pages/SignupPage";
import TableManager from "../../pages/TableManager";
import store from "../../redux";

const MockParent = ({ children }: { children: any }) => {
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
    <Provider store={store}>
      {/* <RouterProvider router={AppRouter} /> */}
      {children}
    </Provider>
  );
};
export default MockParent;
