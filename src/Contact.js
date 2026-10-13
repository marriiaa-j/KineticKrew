import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';

function Contact() {
  return (
    <div className="App">
      <header className="App-header">
        <div>Contact Page</div>

        <Link to={'/'}>Home page</Link>
      </header>
    </div>
  );
}

export default Contact;

