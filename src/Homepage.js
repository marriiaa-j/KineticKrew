import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div className="App">
      <header className="App-header">
        <div>Home Page</div>

        <Link to={'/'}>main page</Link>
      </header>
    </div>
  );
}

export default Homepage;
