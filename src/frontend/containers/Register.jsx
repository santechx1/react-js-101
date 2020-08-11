import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { registerUser } from '../actions';
import '../assets/styles/components/Register.scss';

const Register = (props) => {
  const [form, setValues] = useState({
    email: '',
    name: '',
    password: '',
  });

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.registerUser(form, '/login');
  };

  return (
    <>
      <Header isRegister />
      <section className='register'>
        <section className='register__container'>
          <h2>Register</h2>
          <form className='register__container--form' onSubmit={handleSubmit}>
            <input
              name='name'
              className='register__input'
              type='text'
              placeholder='Name'
              onChange={handleInput}
            />
            <input
              name='email'
              className='register__input'
              type='text'
              placeholder='Email'
              onChange={handleInput}
            />
            <input
              name='password'
              className='register__input'
              type='password'
              placeholder='Password'
              onChange={handleInput}
            />
            <button type='submit' className='register__button'>Register</button>
          </form>
          <Link to='/login'>
            Login
          </Link>
        </section>
      </section>
    </>
  );
};

const mapDispatchToProps = {
  registerUser,
};

Register.propTypes = {
  registerUser: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(Register);
