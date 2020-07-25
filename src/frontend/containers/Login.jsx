import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { loginRequest } from '../actions';
import googleIcon from '../assets/static/google-icon.png';
import twitterIcon from '../assets/static/twitter-icon.png';
import '../assets/styles/components/Login.scss';

const Login = (props) => {
  const [form, setValues] = useState({
    email: '',
  });

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.loginRequest(form);
    props.history.push('/');
  };

  return (
    <>
      <Header isLogin />
      <section className='login'>
        <section className='login__container'>
          <h2>Login</h2>
          <form className='login__container--form' onSubmit={handleSubmit}>
            <input
              name='email'
              className='login__input'
              type='text'
              placeholder='Email'
              onChange={handleInput}
            />
            <input
              name='password'
              className='login__input'
              type='password'
              placeholder='Password'
              onChange={handleInput}
            />
            <button type='submit' className='login__button'>Login</button>
            <div className='login__container--remember-me'>
              <label htmlFor='cbox1'>
                <input type='checkbox' id='cbox1' value='first_checkbox' />
                {' '}
                Remember me
              </label>
              <a href='/'>Forgot my password</a>
            </div>
          </form>
          <section className='login__container--social-media'>
            <div>
              <img src={googleIcon} alt='Google icon' />
              {' '}
              Login with Google
            </div>
            <div>
              <img src={twitterIcon} alt='Twitter icon' />
              {' '}
              Login with Twitter
            </div>
          </section>
          <p className='login__container--register'>
            Don&apos;t have an account? &thinsp;
            <Link to='/register'>Register</Link>
          </p>
        </section>
      </section>
    </>
  );
};

const mapDispatchToProps = {
  loginRequest,
};

export default connect(null, mapDispatchToProps)(Login);
