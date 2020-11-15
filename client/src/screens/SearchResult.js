import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '../App'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

function SearchResult() {
  const [data, setData] = useState([])
  const { state } = useContext(UserContext)
  useEffect(() => {
    // set本页要展示的数据为(state里面的这一项。该项在fetch之后，dispatch到reducer)
    if (state) {
      setData(state.searchResults)
    }
  }, [state])

  const likePost = (id) => {
    fetch('/like', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((res) => {
        // 逻辑 把fetch来的数据 跟state绑定
        const updateLike = data.map((one) => {
          if (one._id === res._id) {
            // return res;
            // 如果后端没有populate
            // 那么这里得
            return { ...one, likes: res.likes }
          } else {
            return one
          }
        })
        setData(updateLike)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const unLikePost = (id) => {
    fetch('/unlike', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      // 此时通过requireLogin, req中已经有了user, 那么再这个req中再加入一个postId
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((res) => {
        // 逻辑 把fetch来的数据 跟state绑定
        const updateUnLike = data.map((one) => {
          if (one._id === res._id) {
            // 如果这里是 return res 那么后端就得populate
            return { ...one, likes: res.likes }
            // return res
          } else {
            return one
          }
        })
        setData(updateUnLike)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({ text, postId }),
    })
      .then((res) => res.json())
      .then((res) => {
        const updateComment = data.map((one) => {
          if (one._id === res._id) {
            return res
          } else {
            return one
          }
        })
        setData(updateComment)
      })

      .catch((err) => {
        console.log(err)
      })
  }

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: 'delete',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        const newData = data.filter((one) => {
          // 不相等的留下
          return one._id !== res._id
        })
        setData(newData)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <>
      {data && state ? (
        <div className='home'>
          {data.map((one) => {
            return (
              <div className='card home-card' key={one._id}>
                {/* h5包含一个link和一个trash 其中Link包含条转条件，名字 
      trash包含显示条件，删除方法*/}
                <h5>
                  {
                    <Link
                      to={
                        one.postedBy._id === state._id
                          ? '/profile'
                          : `/profile/${one.postedBy._id}`
                      }
                    >
                      {one.postedBy.name}
                    </Link>
                  }

                  {/* 序号相等 && <i> */}
                  {one.postedBy._id === state._id && (
                    <i
                      className='material-icons'
                      style={{ float: 'right' }}
                      onClick={() => {
                        deletePost(one._id)
                      }}
                    >
                      delete
                    </i>
                  )}
                </h5>

                <div className='card-image'>
                  <img alt='' src={one.photo} />
                </div>
                <div className='card-content'>
                  {/* login dispatch的时候 把user传给了state */}
                  {one.likes.includes(state._id) ? (
                    <i
                      className='material-icons'
                      style={{ color: 'red' }}
                      onClick={() => {
                        unLikePost(one._id)
                      }}
                    >
                      favorite
                    </i>
                  ) : (
                    <i
                      className='material-icons'
                      style={{ color: 'gray' }}
                      onClick={() => {
                        likePost(one._id)
                      }}
                    >
                      favorite_border
                    </i>
                  )}

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
                      e.preventDefault()
                      // e.target[0]的意思是form中 的 第一个<>内容
                      makeComment(e.target[0].value, one._id)
                    }}
                  >
                    <input type='text' placeholder='Add a comment' />
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        'loading'
      )}
    </>
  )
}

export default SearchResult
