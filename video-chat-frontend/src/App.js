import './App.css';
import { useEffect } from 'react';
import { connectWithWebSocket } from './utils/wssConnection/wssConnection';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage';
import Dashboard from './Dashboard/Dashboard';

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/dashboard", element: <Dashboard />}
]);

function App() {
  useEffect(() => {
    connectWithWebSocket();
  }, []);
  
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
