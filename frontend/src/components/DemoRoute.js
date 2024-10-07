import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function DemoRoute() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default DemoRoute;
