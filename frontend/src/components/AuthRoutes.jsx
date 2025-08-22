import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPageWrapper from './LoginPageWrapper';
import RegisterPageWrapper from './RegisterPageWrapper';

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPageWrapper />} />
      <Route path="/register" element={<RegisterPageWrapper />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}