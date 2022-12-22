import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import "./Nav.css";
import avatar from './assets/avatar.png'
import logo from './assets/logo.png'


function Nav() {
  const [show, handleShow] = useState(false);
  const history = useNavigate();
  
  const transitionNavbar = () => {
    if(window.scrollY > 100){
      handleShow(true);
    }
    else{
      handleShow(false);
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', transitionNavbar);
  
    return () => {
      window.removeEventListener('scroll', transitionNavbar)
    }
  }, [])
  
  return (
    <div className={`nav ${show && 'nav__black'}`}>
        <div className="nav__contents">
            <img onClick={() => history('/')}
                className='nav__logo'
                src={logo}
                alt="" 
            />
            <img onClick={() => history('/profile')} 
                className='nav__avatar'
                src={avatar}
                alt="" />
        </div>
        
    </div>
  )
}

export default Nav