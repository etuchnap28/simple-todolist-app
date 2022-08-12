import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import useFormInput from "../../../../hooks/useFormInput";
import { useRegisterMutation } from "../../auth.service";
import styles from '../Form.module.scss';
import {FaTimes, FaCheck} from 'react-icons/fa'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const NAME_REGEX = /^[A-z][A-z\s]{0,23}$/;

const Register = () => {
  const errParagraphRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();
  
  const [name, nameAttribs, resetName, validName] = useFormInput(useState(''), NAME_REGEX);
  const [username, usernameAttribs, resetUsername, validUsername] = useFormInput(useState(''), USER_REGEX);
  const [password, passwordAttribs, resetPassword, validPassword] = useFormInput(useState(''), PWD_REGEX);
  const [confirmPassword, confirmPwdAttribs, resetConfirmPwd] = useFormInput(useState(''));
  const [matchPwd, setMatchPwd] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  const [register, {isLoading}] = useRegisterMutation();

  const reset = () => {
    resetName();
    resetUsername();
    resetPassword();
    resetConfirmPwd();
  }

  useEffect(() => {
    setErrMsg('');
  }, [name, username, password, confirmPassword])

  useEffect(() => {
    setMatchPwd(password === confirmPassword);
  }, [password, confirmPassword]);

  const valid = validUsername && validPassword && validName && matchPwd && !isLoading;

  const handleFormSubmitted = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await register({username, password, name}).unwrap();
      reset();
      navigate('/login');
    } catch (err: any) {
      setErrMsg(err.data.error.message);
      if (errParagraphRef && errParagraphRef.current) errParagraphRef.current.focus();
    }
  }

  const content = isLoading ? <h1>Loading...</h1> : (
    <div className={styles.form}>
      <section className={styles.formMain}>
        <h1 className={styles.formHeader}>Register</h1>
        <p className={errMsg ? styles.formError : ''} ref={errParagraphRef}>{errMsg}</p>
        <form className={styles.formBody} onSubmit={handleFormSubmitted}>
          <div className={styles.txtField}>
            <input 
              type='text'
              id='name'
              {...nameAttribs}
              autoComplete='off'
              required
            />
            <span></span>
            <label htmlFor="name">Name: </label>
          </div>
          <div className={styles.txtField}>
            <input 
              type='text'
              id='username'
              {...usernameAttribs}
              autoComplete='off'
              required
            />
            <span></span>
            <label htmlFor="username">Username: </label>
          </div>
          <div className={styles.txtField}>
            <input 
              type='password'
              id='password'
              {...passwordAttribs}
              required
            />
            <span></span>
            <label htmlFor="password">Password: </label>
          </div>
          <div className={styles.txtField}>
            <input 
              type='password'
              id='confirmPwd'
              {...confirmPwdAttribs}
              required
            />
            <span></span>
            <label htmlFor="confirmPwd">Confirm password: </label>
          </div>
          <ul className={styles.formRequirements}>
            <li>{validName ? <FaCheck className={styles.valid} /> : <FaTimes />} Name must have at least 1 letter</li>
            <li>{validUsername ? <FaCheck className={styles.valid} /> : <FaTimes />} Username must begin with 1 letter and have at least 4 non-special characters</li>
            <li>{validPassword ? <FaCheck className={styles.valid} /> : <FaTimes />} Password must contain at least 1 uncapitalized letter, 1 capitalized letter, 1 number and 1 special character from !@#$%</li>
            <li>{matchPwd ? <FaCheck className={styles.valid} /> : <FaTimes />} Passwords must match</li>
          </ul>
          <button className={`${styles.formBtn} btnFancyPrimary`} disabled={!valid}>Sign Up</button>
          <p className={styles.loginLink}>Already have an account? <Link to='/login'>Login</Link></p>
          <p className={styles.loginLink}>Back to homepage <Link to='/'>Home</Link></p>
        </form>
      </section>
    </div>
  )
  
  return content;
}

export default Register;