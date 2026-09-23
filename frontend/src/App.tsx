import '@mantine/core/styles.css'; // Required global styles for Mantine
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Header from './pages/components/Header';
import VerifyEmail from './pages/VerifyEmail';

export default function App() {
  
  return (
    <MantineProvider defaultColorScheme="light">
      
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword/>}/>
          <Route path="/verifyemail" element={<VerifyEmail/>}/>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
