import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../App';
import { useEffect } from 'react';
import Searchbox from './Searchbox';
import M from 'materialize-css';

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const side = useRef(null);

  useEffect(() => {
    M.Sidenav.init(side.current);
  }, []);

  const items = [
    <li key='search'>
      <Searchbox />
    </li>,
    <li key='postsfromfollowings'>
      <Link to='/postsfromfollowings'>Followings</Link>
    </li>,
    <li key='profile'>
      <Link to='/profile'>Profile</Link>
    </li>,
    <li key='create'>
      <Link to='createpost'>Create</Link>
    </li>,
    <li key='logout'>
      <Link
        to='/login'
        onClick={() => {
          localStorage.clear();
          dispatch({ type: 'CLEAR' });
        }}
      >
        Logout
      </Link>
    </li>,
  ];

  const renderList = () => {
    if (state) {
      return items;
    } else {
      return [
        <li key='signup'>
          <Link to='/signup'>Sign Up</Link>
        </li>,
        <li key='login'>
          <Link to='/login'>Login</Link>
        </li>,
      ];
    }
  };
  return (
    <div>
      <nav>
        <div className='nav-wrapper white'>
          <Link
            to={state ? '/' : '/login'}
            className='brand-logo left'
            style={{ paddingLeft: '10px' }}
          >
            Instagram-Clone
          </Link>
          <a
            href='#'
            data-target='mobile-demo'
            className='sidenav-trigger right'
          >
            <i className='material-icons'>menu</i>
          </a>
          <ul id='nav-mobile' className='right hide-on-med-and-down'>
            {renderList()}
          </ul>
        </div>
      </nav>
      <ul className='sidenav' id='mobile-demo' ref={side}>
        {renderList()}
      </ul>
    </div>
  );
};

export default Navbar;
