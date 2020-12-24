import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';
import ModalImage from 'react-modal-image';

function UserProfile() {
  const [data, setData] = useState(null);
  // 试着使用
  const { state, dispatch } = useContext(UserContext);
  // 获取url的后缀
  const { userid } = useParams();
  // console.log(userid);
  // const [showfollow, setShowFollow] = useState(
  //   state ? !state.following.includes(userid) : true
  // );

  // 获取一个用户名下的帖子
  // data是这个用户所有的帖子
  // 思想：用data显示celebrity信息，用state显示自己的信息。
  // dispatch是为了更新自己的信息，setData是为了更新celebrity的信息
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
    })
      .then((res) => res.json())
      .then((results) => {
        setData(results);
        // console.log(results.user.followers);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const follow = () => {
    fetch('/follow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        wantToFollow: userid,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        // 设置celebrity的state
        dispatch({
          type: 'FOLLOW',
          payload: { following: res.me.following, followers: res.me.followers },
        });
        // 设置 me的新的local storage
        localStorage.setItem('user', JSON.stringify(res.me));

        // 设置新的data 此时data应该是 这个用户的信息 和他的帖子的信息
        // 这里只更新用户信息 在用户里面，只更新followers信息
        setData((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, res.me._id],
            },
          };
          // console.log(prevState);
        });
        // setShowFollow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unfollow = () => {
    fetch('/unfollow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        wantToUnFollow: userid,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        // 设置celebrity的state
        dispatch({
          type: 'FOLLOW',
          payload: { following: res.me.following, followers: res.me.followers },
        });
        // 设置 me的新的local storage
        localStorage.setItem('user', JSON.stringify(res.me));

        // 设置新的data 此时data应该是 这个用户的信息 和他的帖子的信息
        // 这里只更新用户信息 在用户里面，只更新followers信息
        setData((prevState) => {
          const withOutMe = prevState.user.followers.filter(
            (i) => i !== res.me._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: withOutMe,
            },
          };
          // console.log(prevState);
        });
        // setShowFollow(true);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(data.user.followers);
  };
  return (
    <>
      {data ? (
        <div style={{ maxWidth: '700px' }} className='container'>
          {/* data是celebrity*/}
          {/* state是me登录用户 */}

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
                src={data.user.pic}
                alt=''
              />
            </div>
            <div className='col s5 offset-s1'>
              <h4>{data.user.name}</h4>
              <h5>{data.user.email}</h5>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <h6>{data.posts.length} Posts</h6>
                <h6>{data.user.followers.length} Followers</h6>
                <h6>{data.user.following.length} Following</h6>
              </div>
              {/* 如果data的followers中包含state._id 则显示unfowllow, 否则follow */}
              {data.user.followers.includes(state._id) ? (
                <button
                  className='btn #64b5f6 blue darken-1'
                  style={{ margin: '1em 0em' }}
                  onClick={() => unfollow()}
                >
                  UnFollow
                </button>
              ) : (
                <button
                  className='btn #64b5f6 blue darken-1'
                  style={{ margin: '1em 0em' }}
                  onClick={() => follow()}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
          <div className='row'>
            {data.posts.map((one, idx) => (
              // <img className='item col s1' key={idx} alt='' src={one.photo} />
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
        <h4>Loading...</h4>
      )}
    </>
  );
}

export default UserProfile;
