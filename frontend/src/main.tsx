import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  fontFamily: "'Poppins', sans-serif", 
  headings: {
    fontFamily: "'Poppins', sans-serif",
    sizes: {
      h1: { fontWeight: '700' },
      h2: { fontWeight: '600' },
      h3: { fontWeight: '500' },
      h4: { fontWeight: '400' },
      h5: { fontWeight: '300' },
      h6: { fontWeight: '300' },
    },
  },
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
)
