import React, { useEffect } from 'react';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from './screens/LoginScreen';
import { auth } from './firebase-config';
import { onAuthStateChanged } from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';
import  ProfileScreen  from './screens/ProfileScreen.js';


function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if(userAuth){
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email,
        }))
      } else {
        dispatch(logout())
      }
    }
    )
    return unsubscribe;
  }, [dispatch]);
  return (
    <div className="app">
      
      <Router>
        {!user ? (<LoginScreen />) : (
          <Routes>
            <Route exact path='/profile' element={<ProfileScreen />} />
            <Route exact path='/' element = {<HomeScreen />} />
          </Routes>
        )}
        
      </Router>
    </div>
  );
}

export default App;
