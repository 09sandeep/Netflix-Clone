import { signOut } from 'firebase/auth';
import React from 'react'
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { auth } from '../firebase-config';
import Nav from '../Nav';
import './ProfileScreen.css'
import avatar from '../assets/avatar.png'
import PlansScreen from './PlansScreen';

function ProfileScreen() {
    const user = useSelector(selectUser)
  return (
    <div className='profileScreen'>
        <Nav />
        <div className="profileScreen__body">
            <h1>Edit Profile</h1>
            <div className="profileScreen__info">
                <img src={avatar}
                 alt="" />
                 <div className="profileScreen__details">
                    <h2>{user.email}</h2>
                    <div className="profileScreen__plans">
                        <h3>Plans</h3>
                        <PlansScreen />
                        <button onClick={() => signOut(auth)}
                         className='profileScreen__signOut'>Sign Out</button>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  )
}

export default ProfileScreen;