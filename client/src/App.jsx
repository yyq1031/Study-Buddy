import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn';
import NavigationBar from './components/NavigationBar';
import AccountPage from './pages/Account';
import Lessons from './pages/Lessons';

function App() {
  return(
    <Router>
      <NavigationBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About/>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/lessons" element={<Lessons />} />
      </Routes>
    </Router>
  )
}

export default App;
