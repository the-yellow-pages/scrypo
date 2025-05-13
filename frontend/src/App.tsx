import './App.css';
import logo from './assets/logo-scrypo.png';
import { WalletConnectorModal } from './WalletConnectorModal';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Map from './pages/Map/Map';
import Profile from './pages/Profile/Profile';

function App() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <header className="main-header">
        <img src={logo} alt="Scrypo Logo" className="app-logo" />
        <h2>Welcome to the Application</h2>
      </header>
      <nav className="navbar">
        <div className="navbar-top">
          <WalletConnectorModal />
        </div>
        <div className="navbar-bottom">
          <button className="navbar-button" onClick={() => navigate('/map')}>Map</button>
          <button className="navbar-button" onClick={() => navigate('/profile')}>Profile</button>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/map" element={<Map />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
