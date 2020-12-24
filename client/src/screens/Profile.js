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
            <div
              style={{
                maxWidth: '150px',
                height: 'auto',
                marginBlock: 'auto',
                marginRight: '20px',
              }}
            >
              <img
                style={{
                  width: '100%',
                  borderRadius: '50%',
                }}
                src={state.pic}
                alt=''
              />
            </div>
            <div style={{ marginLeft: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <h5>{state.name}</h5>
                <i className='material-icons' style={{ marginTop: '15px' }}>
                  <Link to='/update'>edit</Link>
                </i>
              </div>
              <h6 style={{ margin: '0px 0px 10px 0px' }}>{state.email}</h6>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div>
                      Posts
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        {myPosts.length}
                      </div>
                    </div>
                    <div style={{ padding: '0px 20px' }}>
                      Followers
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        {state.followers.length}
                      </div>
                    </div>
                    <div>
                      Following
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        {state.following.length}
                      </div>
                    </div>
                  </div>
                </div>
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
