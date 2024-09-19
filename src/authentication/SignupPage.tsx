import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SignupStyle from '../Style/Signup.module.css'; // Import CSS module

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email domain
    const emailDomain = email.split('@')[1];
    if (emailDomain !== 'company.com') {
      setError('Email must be an official company email (e.g., user@company.com)');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/signup', {
        username,
        email,
        phone,
        password,
      });
      console.log('Signup successful:', response.data);
      if (response.status === 200) {
        // Navigate to the login page after successful signup
        navigate('/login');
      }
    } catch (err: any) {
      console.error('Error during signup:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className={SignupStyle.page}>
      <div className={SignupStyle.container}>
        <div className={SignupStyle.left}>
          <div className={SignupStyle.signup}>Signup</div>
          <div className={SignupStyle.eula}>
            By signing up you agree to the terms and conditions.
          </div>
        </div>
        <div className={SignupStyle.right}>
          <form className={SignupStyle.form} onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className={SignupStyle.error}>{error}</div>}
            <input type="submit" id="submit" value="Signup" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
