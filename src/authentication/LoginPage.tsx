import React, { useState } from 'react';
import anime from 'animejs/lib/anime.es.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loginstyle from '../Style/Login.module.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentAnimation, setCurrentAnimation] = useState<any>(null);
  const navigate = useNavigate();

  const handleFocus = (animationParams: any) => {
    if (currentAnimation) currentAnimation.pause();
    setCurrentAnimation(anime(animationParams));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/authenticate', {
        email,
        password,
      });
      console.log('Authenticated:', response.data);
      if (response.status === 200) {
        navigate('/');
        console.log('token', )
      }
    } catch (err) {
      console.error('Error during authentication:', err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className={loginstyle.page}>
      <div className={loginstyle.container}>
        <div className={loginstyle.left}>
          <div className={loginstyle.login}>Login</div>
          <div className={loginstyle.eula}>
            By logging in, you agree to the ridiculously long terms that you didn't bother to read.
          </div>
        </div>
        <div className={loginstyle.right}>
          <svg viewBox="0 0 320 300" className={loginstyle.svgContainer}>
            <defs>
              <linearGradient
                id="linearGradient"
                x1="13"
                y1="193.49992"
                x2="307"
                y2="193.49992"
                gradientUnits="userSpaceOnUse"
              >
                <stop style={{ stopColor: '#ff00ff' }} offset="0" />
                <stop style={{ stopColor: '#ff0000' }} offset="1" />
              </linearGradient>
            </defs>
            <path d="M 40,120.00016 239.99984,-3.2e-4 c 0,0 24.99263,0.79932 25.00016,35.00016 0.008,34.20084 -25.00016,35 -25.00016,35 h -239.99984 c 0,-0.0205 -25,4.01348 -25,38.5 0,34.48652 25,38.5 25,38.5 h 215 c 0,0 20,-0.99604 20,-25 0,-24.00396 -20,-25 -20,-25 h -190 c 0,0 -20,1.71033 -20,25 0,24.00396 20,25 20,25 h 168.57143" />
          </svg>
          <form className={loginstyle.form} onSubmit={handleSubmit}>
            <label htmlFor="email" className={loginstyle.label}>Email</label>
            <input
              type="email"
              id="email"
              className={loginstyle.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleFocus({
                targets: `.${loginstyle.svgContainer} path`,
                strokeDashoffset: {
                  value: 0,
                  duration: 700,
                  easing: 'easeOutQuart'
                },
                strokeDasharray: {
                  value: '240 1386',
                  duration: 700,
                  easing: 'easeOutQuart'
                }
              })}
              required
            />
            <label htmlFor="password" className={loginstyle.label}>Password</label>
            <input
              type="password"
              id="password"
              className={loginstyle.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus({
                targets: `.${loginstyle.svgContainer} path`,
                strokeDashoffset: {
                  value: -336,
                  duration: 700,
                  easing: 'easeOutQuart'
                },
                strokeDasharray: {
                  value: '240 1386',
                  duration: 700,
                  easing: 'easeOutQuart'
                }
              })}
              required
            />
            {error && <div className={loginstyle.error}>{error}</div>}
            <input
              type="submit"
              value="Submit"
              className={loginstyle.submit}
              onFocus={() => handleFocus({
                targets: `.${loginstyle.svgContainer} path`,
                strokeDashoffset: {
                  value: -730,
                  duration: 700,
                  easing: 'easeOutQuart'
                },
                strokeDasharray: {
                  value: '530 1386',
                  duration: 700,
                  easing: 'easeOutQuart'
                }
              })}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
