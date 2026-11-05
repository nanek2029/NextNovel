import '@mantine/core/styles.css'; // Required global styles for Mantine
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Header from './secondary/Header';
import VerifyEmail from './pages/VerifyEmail';
import Recommendation from './pages/Recommendation';
import Bookshelf from './pages/Bookshelf';
import Account from './pages/Account';
import ResetCode from './pages/ResetCode';
import ResetPassword from './pages/ResetPassword';
import Search from './pages/Search';
import Questionnaire from './pages/Questionnaire';
import AdminDashboard from './pages/AdminDashboard';
import CheckStatus from './secondary/checkStatus'; 

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
          <Route path="/reset-code" element={<ResetCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          // routes that need to be protected 
          <Route path="/bookshelf" element={
            <CheckStatus>
              <Bookshelf />
            </CheckStatus>} />

          <Route path="/recommendation" element={
            <CheckStatus>
              <Recommendation />
            </CheckStatus>} />
          <Route path="/account" element={
            <CheckStatus>
              <Account />
            </CheckStatus>} />

          <Route path="/search" element={
            <CheckStatus>
              <Search />
            </CheckStatus>} />

          <Route path="/questionnaire" element={
            <CheckStatus>
              <Questionnaire />
            </CheckStatus>} />

          <Route path="/admin-dashboard" element={
            <CheckStatus adminOnly={true}>
              <AdminDashboard />
            </CheckStatus>} />
            
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
