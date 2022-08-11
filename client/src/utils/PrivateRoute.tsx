import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectToken } from '../features/auth/authSlice';

const PrivateRoute = () => {
  const token = useAppSelector(selectToken);
  const location = useLocation();

  return (
    token ? <Outlet /> : <Navigate to='login' state={{from: location}} replace />
  )
}

export default PrivateRoute