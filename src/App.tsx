import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Navigation from './components/Navigation';
import TasksPage from './pages/TasksPage';
import UpgradePage from './pages/UpgradePage';
import StatisticsPage from './pages/StatisticsPage';
import MovePage from './pages/MovePage';
import AboutPage from './pages/AboutPage';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/upgrade" element={<UpgradePage />} />
                    <Route path="/" element={<MovePage />} />
                    <Route path="/statistics" element={<StatisticsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
                <Navigation />
            </div>
        </Router>
    );
};

export default App;