import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout/AppLayout';
import Login from './features/auth/components/Login/Login';
import Register from './features/auth/components/Register/Register';
import TasksList from './features/tasks/components/TasksList/TasksList';
import Home from './pages/Home/Home';
import PrivateRoute from './utils/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="register" element={<Register />}/>
      <Route path="login" element={<Login />}/>
      
      <Route element={<PrivateRoute />}>
        <Route path='app' element={<AppLayout />}>
          <Route path='tasks' element={<TasksList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
