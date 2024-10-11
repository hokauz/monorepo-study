import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './layout/Dashboard';
import BannerPage from './pages/BannerPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} >
          <Route index element={<Home />} />
          <Route path="banner" element={<BannerPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logout" element={<Logout />} />
          <Route path="banner" element={<Banner />} />
        </Route>
        {/* Adicione outras rotas aqui conforme necessário */}
      </Routes>
    </Router>
  );
};

const Home = () => <div><h1>Dashboard Content</h1><p>This is the main content area.</p></div>;
const Settings = () => <div><h1>Settings</h1><p>This is the settings page.</p></div>;
const Logout = () => <div><h1>Logout</h1><p>This is the logout page.</p></div>;
const Banner = () => <div><h1>Banner</h1><p>This is the banner content.</p></div>;

export default App;