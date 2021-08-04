import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './RegisterForm.css';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [image_url, setImageUrl] = useState('');

  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
        email: email,
        first_name: first_name,
        last_name: last_name,
        image_url: image_url,
      },
    });
  }; // end registerUser

  return (
    <form className="formPanel" onSubmit={registerUser}>
      <h2>Register User</h2>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}
      <div className="formInput" >
        <label htmlFor="username">
          Username:
          <input
            type="text"
            name="username"
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
      </div>
      <div className="formInput" >
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
      </div>
      <div className="formInput" >
        <label htmlFor="email">
          Email:
          <input
            type="text"
            name="email"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
      </div>
      <div className="formInput" >
        <label htmlFor="first_name">
          First name:
          <input
            type="text"
            name="first_name"
            value={first_name}
            required
            onChange={(event) => setFirstName(event.target.value)}
          />
        </label>
      </div>
      <div className="formInput" >
        <label htmlFor="last_name">
          Last name:
          <input
            type="text"
            name="last_name"
            value={last_name}
            required
            onChange={(event) => setLastName(event.target.value)}
          />
        </label>
      </div>
      <div className="formInput" >
        <label htmlFor="image_url">
          Image URL:
          <input
            type="text"
            name="image_url"
            value={image_url}
            onChange={(event) => setImageUrl(event.target.value)}
          />
        </label>
      </div>
      <div>
        <input className="btn" type="submit" name="submit" value="Register" />
      </div>
    </form>
  );
}

export default RegisterForm;
