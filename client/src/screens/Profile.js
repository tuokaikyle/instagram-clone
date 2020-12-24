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
        <div style={{ maxWidth: '700px' }} className='container'>
          <div
            className='row'
            style={{
              display: 'flex',
              padding: '15px 0px',
              marginBottom: '15px',
              borderBottom: '1px solid grey',
            }}
          >
            <div style={{ margin: 'auto 5px' }}>
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
            <div className='col s5 offset-s1'>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <h4>{state.name}</h4>
                <i className='material-icons' style={{ marginTop: '1.25em' }}>
                  <Link to='/update'>edit</Link>
                </i>
              </div>
              <h5>{state.email}</h5>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
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
                className='col s4 cell'
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
