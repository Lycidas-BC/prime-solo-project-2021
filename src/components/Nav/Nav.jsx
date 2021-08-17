import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import {useSelector} from 'react-redux';

function Nav() {
  const user = useSelector((store) => store.user);

  let loginLinkData = {
    path: '/login',
    text: 'Login / Register',
  };

  if (user.id != null) {
    loginLinkData.path = '/collection';
    loginLinkData.text = 'My Collection';
  }

  return (
    <div className="nav">
      <Link to="/home">
        <h2 className="nav-title">CineFiles</h2>
      </Link>
      <a href="https://www.themoviedb.org/"><p className="navLink"> with data from <img src={`https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg`} style={{height: "12px"}}/></p></a>
      <div>
        <Link className="navLink" to={loginLinkData.path}>
          {loginLinkData.text}
        </Link>
        <Link className="navLink" to="/search">
          Search
        </Link>
        {user.id && (
          <>
            <Link className="navLink" to="/add_media">
              Add Media
            </Link>
            <Link className="navLink" to="/info">
              Info Page
            </Link>
            <LogOutButton className="navLink" />
          </>
        )}

        <Link className="navLink" to="/about">
          About
        </Link>
      </div>
    </div>
  );
}

export default Nav;
