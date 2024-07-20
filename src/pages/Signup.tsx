import React from 'react';
import { Link } from 'react-router-dom';

const Signup: React.FC = () => {
  return (
    <div>
      <h1>Sign Up Page</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/forgot_password">Forgot Password</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Signup;
