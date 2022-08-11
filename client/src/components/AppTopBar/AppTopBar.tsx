import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../../features/auth/auth.service';
import styles from './AppTopBar.module.scss'

const AppTopBar = () => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <header className={styles.appTopbar}>
      <h1>Simple Todolist</h1>
      <button onClick={handleLogout}>Logout</button>
    </header>
  )
}

export default AppTopBar