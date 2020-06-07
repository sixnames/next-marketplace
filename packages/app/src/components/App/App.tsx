import React from 'react';
import AppLayout from '../AppLayout/AppLayout';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  console.log(process.env);
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
