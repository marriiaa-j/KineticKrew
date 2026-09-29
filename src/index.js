import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
<<<<<<< HEAD
import {
=======
import{
>>>>>>> 901c7e2 (testing)
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Contact from './Contact';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/contact",
    element: <Contact/>,
  },
]);
<<<<<<< HEAD

=======
>>>>>>> 901c7e2 (testing)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <RouterProvider router={router} />
=======
    <RouterProvider router = {router} />
>>>>>>> 901c7e2 (testing)
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
