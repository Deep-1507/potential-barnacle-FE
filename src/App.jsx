import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {Home} from "./pages/Home.jsx"
import {Years} from "./pages/Years.jsx"
import {Subjects} from "./pages/Subjects.jsx"
import { Auth } from './pages/Auth.jsx';
import { Faculty } from './pages/Faculty.jsx';

function App() {
 
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/faculty" element={<Faculty/>} />
          <Route path="/years/:id" element={<Years/>} />
          <Route path="/subject/:branchId/:yearId/:subjectId/:subjectName" element={<Subjects/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
