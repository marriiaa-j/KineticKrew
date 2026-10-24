import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <br />
        <Link to="/landingpage">Landing Page</Link>
        <br />
        <Link to="/SignIn">Go to Sign In</Link>
        <br />
        <Link to="/Questionnaire">Questionnaire</Link>
        <br />
        <Link to="/signin">Go to Sign In</Link>
        <br />
        <Link to="/signup">Go to Sign Up</Link>
        <br />
        <Link to="/homepage">Homepage</Link>
        <br />
        
      </header>
    </div>
  );
}

export default App;

