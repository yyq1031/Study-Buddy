import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import AccountPage from './pages/Account';
import NavigationBar from './components/NavigationBar';
import Dashboard from './pages/Teacher/Dashboard';
import TeacherUploadInterface from './pages/Teacher/TeacherUploadInterface';
import LessonPage from './pages/Lesson';
import ClassesPage from './pages/student/Classes';
import Quiz from './pages/student/Quiz';
import LessonPage from './pages/student/Lesson'; 
import SignOut from './pages/SignOut';


function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
      
    } catch (error) {
      console.warn(error);
      console.warn("Invalid JSON in localStorage 'user':", savedUser);
      localStorage.removeItem('user');
      return null;
    }
  });

  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About/>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path='/dashboard' element={<Dashboard /> }/>
        <Route path='/teacheruploadinterace' element={<TeacherUploadInterface /> }/>
        <Route path='/lessons' element={<LessonPage /> }/> 
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/signin"
          element={!user ? (
            <SignIn onSignIn={(userData) => {
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
            }} />
          ) : (
            <Navigate to={user.role === 'student' ? "/classes" : "/account"} />
          )}
        />
        <Route path="/account" element={user?.role === 'teacher' ? <AccountPage /> : <Navigate to="/" />} />
        <Route path="/classes" element={user?.role === 'student' ? <ClassesPage user={user} /> : <Navigate to="/" />} />
        <Route path="/class/:classId/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/quiz/:classId/:lessonId" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
