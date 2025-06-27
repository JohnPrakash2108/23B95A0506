import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UrlShortenerPage from './UrlShortenerPage';
import UrlStatisticsPage from './UrlStatisticsPage';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UrlShortenerPage />} />
        <Route path="/stats" element={<UrlStatisticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
