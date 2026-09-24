import '@mantine/core/styles.css'; // Required global styles for Mantine
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Header from './components/Header';
import VerifyEmail from './pages/VerifyEmail';
import Recommendation from './pages/Recommendation';
import Bookshelf from './pages/Bookshelf';
import Account from './pages/Account';

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
          <Route path="/bookshelf" element={<Bookshelf />}/>
          <Route path="/recommendation" element={<Recommendation/>}/>
          <Route path="/account" element={<Account/>}/>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
