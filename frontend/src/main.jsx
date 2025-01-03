import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Employees from '@pages/Employees';
import Orders from '@pages/Orders'; 
import Menu from '@pages/Menu'; 
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import BatchesPage from '@pages/Inventory/BatchesPage';
import Turnos from '@pages/Turnos'; // Import your Turnos page
import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/empleados',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Employees />
          </ProtectedRoute>
        ),
      },
      {
        path: '/batches',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'usuario' , 'cocinero']}>
            <BatchesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'usuario' , 'mesero' , 'cocinero']}>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: '/menu', 
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'usuario' , 'cocinero', 'mesero']}>
            <Menu />
          </ProtectedRoute>
        ),
      },
      // New Turnos route added
      {
        path: '/turnos',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'cocinero', 'mesero']}>
            <Turnos />
          </ProtectedRoute>
        ),
      },
    ]
  },
  {
    path: '/auth',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
