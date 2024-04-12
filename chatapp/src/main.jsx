import React from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM directly
import App from './App.jsx';
import './index.css';
import Login from './components/Login.jsx';
import Sign from './components/Signup.jsx';
import MsgDiv from './components/msg.jsx';
import Home from './components/home.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'Login', element: <Login /> },
      { path: 'SignUp', element: <Sign/> },
      { path: 'MsgDiv', element: <MsgDiv /> }
    ]
  }
];

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
