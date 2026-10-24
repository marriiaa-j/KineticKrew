import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";

import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';
import LandingPage from './LandingPage';
import SignIn from './SignIn';
import SignUp from './SignUp' ;
import ForgotPassword from "./ForgotPassword";
import ForgotUsername from "./ForgotUsername";
import Questionnaire from './Questionnaire';
import Homepage from './Homepage';
import FitnessQuestions from './FitnessQuestions';




const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/landingpage",
    element: <LandingPage />,
  },
  {
  path: "/forgot-password",
  element: <ForgotPassword />,
 
},
{
  path: "/forgot-username",
  element: <ForgotUsername />,
},
  {
  path: "/signup",
  element: <SignUp />,
  },
  {
    path: "/homepage",
    element: <Homepage/>,
  },
  {
    path: "/signin",
    element: <SignIn/>,
  },
  {
    path: '/questionnaire',
    element: <Questionnaire />,
  },
  {
    path: '/fitness-questions',
    element: <FitnessQuestions />,
  },
  {
  path: '/fitnessquestions',
  element: <FitnessQuestions />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router = {router} />

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
