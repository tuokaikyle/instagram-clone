import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../App';
import { useEffect } from 'react';
import M from 'materialize-css';

function HomeVisitor() {
  const [data, setData] = useState([]);
  const { state } = useContext(UserContext);
  useEffect(() => {
    fetch('/allposts', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((results) => setData(results.allPosts))
      .catch((err) => console.log(err));
  }, []);

  const likePost = (id) => {
    M.toast({ html: 'Login is need :-)', classes: 'pink accent-2' });
  };

  const makeComment = (text, postId) => {
    M.toast({ html: 'Login is need :-)' });
  };

  return (
    <>
      {data ? (
        <div className='container'>
          {data.map((one) => {
            return (
              <div className='card home-card' key={one._id}>
                <h5
                  onClick={() => {
                    likePost(one._id);
                  }}
                  style={{ padding: '10px 0px 5px 10px' }}
                >
                  {one.postedBy.name}
                </h5>

                <div className='card-image'>
                  <img
                    alt=''
                    src={one.photo}
                    onClick={() => {
                      likePost(one._id);
                    }}
                  />
                </div>
                <div className='card-content'>
                  <i
                    className='material-icons'
                    style={{ color: 'gray' }}
                    onClick={() => {
                      likePost(one._id);
                    }}
                  >
                    favorite_border
                  </i>

                  <h6>{one.likes.length} people like this post</h6>
                  <h6>{one.title}</h6>
                  <p>{one.body}</p>
                  {one.comments.map((v, k) => (
                    <h6 key={k}>
                      <span style={{ fontWeight: 500 }}>
                        {v.postedBy.name + ' '}
                      </span>
                      {v.text}
                    </h6>
                  ))}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // e.target[0]的意思是form中 的 第一个<>内容
                      makeComment(e.target[0].value, one._id);
                    }}
                  >
                    <input type='text' placeholder='Add a comment' />
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        'loading'
      )}
    </>
  );
}

export default HomeVisitor;
