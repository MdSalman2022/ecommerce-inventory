import { createBrowserRouter } from "react-router-dom";
import Main from "../../layout/Main/Main";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Customers from "../../pages/Customers/Customers";
import StartOrder from "../../pages/StartOrder/StartOrder";
import Products from "../../pages/Products/Products";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/customers",
        element: <Customers />,
      },
      {
        path: "/start-order",
        element: <StartOrder />,
      },
      {
        path: "/products",
        element: <Products />,
      },
    ],
  },
]);
