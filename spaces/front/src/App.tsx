import './App.css';
import { Routes, Route } from 'react-router-dom';
import ScanPage from './pages/scan/scan.page';
import NotFoundPage from './pages/404/404.page';

function App() {
    return (
        <>
            <span id="newTabInformer" hidden>Link opens in a new tab</span>
            <Routes>
                <Route path="/" element={<ScanPage />} />

                {/* Catch-all for 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

        </>
    );
}

export default App;
