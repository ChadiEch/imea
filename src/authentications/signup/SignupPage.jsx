import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signup } from '../auth/authSlice'; // Adjust path as needed

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message before attempting signup

    try {
      const resultAction = await dispatch(signup({ email, password, name }));
      
      if (signup.fulfilled.match(resultAction)) {
        // Redirect to login page after successful sign-up
        navigate('/login');
      } else {
        // Display error message from payload if sign-up failed
        setError(resultAction.payload?.message || 'Sign-up failed. Please try again.');
      }
    } catch (err) {
      // Set a generic error message if an exception occurs
      setError('Sign-up failed. Please try again.');
    }
  };

  return (
    <div className='container'>
      {/* Back to Home button */}
      <div className="back-button">
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>

      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Sign Up</button>
      </form>

     
       <div className="signup-redirect">
       <p>Already have an account?</p>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  );
};

export default SignupPage;
