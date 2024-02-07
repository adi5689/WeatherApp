import './App.css';
import Weather from './components/Weather';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComp from './components/LoginComp';
import { useAuth } from './Auth/AuthProvider';
import UserTable from '../src/components/UserTable';



 
function App() {
  const { currentUser } = useAuth();


  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={currentUser ? <Weather /> : <LoginComp />} />
        <Route path="/users" element={<UserTable />} />
        <Route path="/login" element={<LoginComp />} />
        <Route path="/weather" element={<Weather />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
