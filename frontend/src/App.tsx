import '@mantine/core/styles.css'; // Required global styles for Mantine
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your pages
import Home from './pages/Home';
import Login from './pages/Login';

export default function App() {
  
  return (
    <MantineProvider defaultColorScheme="light">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
