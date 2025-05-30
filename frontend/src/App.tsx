import './App.css';
import logo from './assets/logo-scrypo.png';
import { WalletConnectorModal } from './WalletConnectorModal';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Maps from './pages/Map/Map';
import Profile from './pages/Profile/Profile';
import ProfileDeploy from './pages/Profile/ProfileDeploy';
import Pings from './pages/Pings/Pings';

function App() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <header className="main-header">
        <img src={logo} alt="Scrypo Logo" className="app-logo" />
        <h2>See Crypto, Meet people</h2>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/map" element={<Maps />} />
          <Route path="/profile/:address" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/deploy" element={<ProfileDeploy />} />
          <Route path="/pings" element={<Pings />} />
        </Routes>
      </main>
      <nav className="navbar">
        <div className="navbar-top">
          <WalletConnectorModal />
        </div>
        <div className="navbar-bottom">
          <button className="navbar-button" onClick={() => navigate('/map')}>Map</button>
          <button className="navbar-button" onClick={() => navigate('/profile')}>Profile</button>
          <button className="navbar-button" onClick={() => navigate('/pings')}>Pings</button>
        </div>
      </nav>
    </div>
  );
}

export default App;
