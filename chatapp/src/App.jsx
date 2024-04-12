import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Home from './components/home';
import { Container, Center } from "@chakra-ui/react";
const App = () => {
  return (
    <>
      {/* <Home /> */}
      <Outlet /> 
    </>
  );
};

export default App;
