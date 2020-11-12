import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../App'
import { useEffect } from 'react'
import Searchbox from './Searchbox'

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext)

  const renderList = () => {
    if (state) {
      // 这里班会列表里面的内容 所以不包含[]
      return [
        <li key='postsfromfollowings'>
          <Link to='/postsfromfollowings'>My Followings</Link>
        </li>,
        <li key='profile'>
          <Link to='/profile'>Profile</Link>
        </li>,
        <li key='create'>
          <Link to='createpost'>Create Post</Link>
        </li>,
        <li key='logout'>
          <Link
            to='/login'
            onClick={() => {
              localStorage.clear()
              dispatch({ type: 'CLEAR' })
            }}
          >
            Logout
          </Link>
        </li>,
      ]
    } else {
      return [
        <li key='signup'>
          <Link to='/signup'>Sign Up</Link>
        </li>,
        <li key='login'>
          <Link to='/login'>Login</Link>
        </li>,
      ]
    }
  }
  return (
    <div>
      <nav>
        <div
          className='nav-wrapper white'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <div>
            <Link to={state ? '/' : '/login'} className='brand-logo left'>
              Instagram
            </Link>
          </div>
          <Searchbox />
          <ul id='nav-mobile'>{renderList()}</ul>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
