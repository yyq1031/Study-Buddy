import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn';
import NavigationBar from './components/NavigationBar';
import Dashboard from './pages/Teacher/Dashboard';
import TeacherUploadInterface from './pages/Teacher/TeacherUploadInterface';

function App() {
  return(
    <Router>
      <NavigationBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About/>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path='/dashboard' element={<Dashboard /> }/>
        <Route path='/teacheruploadinterace' element={<TeacherUploadInterface /> }/>
      </Routes>
    </Router>
  )
}

export default App
