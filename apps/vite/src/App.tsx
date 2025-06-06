import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from "./pages/home";
import { mainLayout } from "./components/layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: mainLayout({ children: <Outlet /> }),
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
