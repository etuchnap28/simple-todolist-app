import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { persistor } from '../../../../app/store';
import useFormInput from '../../../../hooks/useFormInput';
import { useLoginMutation } from '../../auth.service';
import styles from '../Form.module.scss';

const Login = () => {
  const errParagraph = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();

  const [username, usernameAttribs, resetUsername] = useFormInput(useState(''));
  const [password, passwordAttribs, resetPassword] = useFormInput(useState(''));
  const [persist, setPersist] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [login, {isLoading}] = useLoginMutation();

  const reset = () => {
    resetUsername();
    resetPassword();
  }

  useEffect(() => {
    setErrMsg('');
  }, [username, password])

  const valid = username && password && !isLoading;

  const handleFormSubmitted = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await login({username, password}).unwrap();
      reset();

      navigate('/app/tasks');
    } catch (err: any) {
      console.log(err);
      if (errParagraph && errParagraph.current) errParagraph.current.focus();
    }
  }

  const togglePersist = () => {
    setPersist(prev => !prev);
  }

  useEffect(() => {
    if (!persist) {
      persistor.pause();
    } else {
      persistor.persist();
    }
  }, [persist])

  const content = isLoading ? <h1>Loading...</h1> : (
    <div className={styles.form}>
      <section className={styles.formMain}>
        <h1 className={styles.formHeader}>Login</h1>
        <form className={styles.formBody} onSubmit={handleFormSubmitted}>
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
          <button className={`${styles.formBtn} btnFancyPrimary`} disabled={!valid}>Sign In</button>
          <label htmlFor="persist">Trust this device </label>
          <input
            type="checkbox"
            id="persist"
            onChange={togglePersist}
            checked={persist}
          />
          <p className={styles.loginLink}>Does not have an account? <Link to='/register'>Sign Up</Link></p>
          <p className={styles.loginLink}>Back to homepage <Link to='/'>Home</Link></p>
        </form>
      </section>
    </div>
  )
  
  return content;
}

export default Login