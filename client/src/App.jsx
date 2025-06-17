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
import LessonPage from './pages/student/Lesson';
import ClassesPage from './pages/student/Classes';
import Quiz from './pages/student/Quiz';
import SignOut from './pages/SignOut';
import Subject from './pages/student/Subject';
import PreferencePage from './pages/student/Preference';
import Transcript from './pages/student/Transcript';
import Assignment from './pages/student/Assignment';
import AddClass from './pages/Teacher/AddClass';
import SignUp from './pages/SignUp';

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
        <Route path="/signup" element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard /> }/>
        <Route path='/teacheruploadinterace' element={<TeacherUploadInterface /> }/>
        <Route path='/lesson' element={<LessonPage /> }/> 
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
        <Route path="/signout" onSignIn={() => {setUser(user)}}
        element={<SignOut />} />
        <Route path="/quiz/:classId/:lessonId" element={<Quiz />} />
        <Route path="/preference" element={<PreferencePage />} />
        <Route path="/transcript" element={<Transcript />} />
        <Route path="/class/:classId"
        element={user?.role === 'student' ? <Subject user={user} /> : <Navigate to="/" />}
        />
        <Route path="/class/:classId/assignment/:assignmentId"
        element={user?.role === 'student' ? <Assignment /> : <Navigate to="/" />}
        />
        <Route path="/test" element={<AddClass />} />
      </Routes>
    </Router>
  );
}

export default App;
