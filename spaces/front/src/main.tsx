import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
    theme: {
        tokens: {
            fontSizes: {
                xs: { value: '1rem' },
                sm: { value: '1.4rem' },
                md: { value: '1.6rem' },
                lg: { value: '2rem' },
            },
        },
    },
});

const system = createSystem(defaultConfig, config);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ChakraProvider value={system}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ChakraProvider>
    </StrictMode>,
);