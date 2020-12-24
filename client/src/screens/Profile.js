import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';
import ModalImage from 'react-modal-image';

function Profile() {
  const [myPosts, setMyPosts] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch('/myposts', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
    })
      .then((res) => res.json())
      .then((res) => {
        setMyPosts(res.mine);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {state && myPosts != [] ? (
        <div
          style={{ maxWidth: '550px', margin: '0px auto' }}
          className='all-1'
        >
          <div
            className='up-2'
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              padding: '15px 0px',
              marginBottom: '10px',
              borderBottom: '1px solid grey',
            }}
          >
            <div className='pic-3'>
              <img
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '80px',
                }}
                src={state.pic}
                alt=''
              />
            </div>
            <div className='name-3'>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '108%',
                }}
              >
                <h4>{state.name}</h4>
                <div
                  style={{
                    margin: '1.52rem 0 .912rem',
                  }}
                >
                  <i className='material-icons'>
                    <Link to='/update'>edit</Link>
                  </i>
                </div>
              </div>
              <h5>{state.email}</h5>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '108%',
                }}
              >
                <h6>{myPosts.length} Posts</h6>
                <h6>{state.followers.length} Followers</h6>
                <h6>{state.following.length} Following</h6>
              </div>
            </div>
          </div>
          <div className='row'>
            {myPosts.map((one, idx) => (
              <ModalImage
                className='col s4'
                key={idx}
                small={one.photo}
                large={one.photo}
              />
            ))}
          </div>
        </div>
      ) : (
        'loading'
      )}
    </>
  );
}

export default Profile;
