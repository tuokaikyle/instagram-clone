import React from 'react'
import { useState } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState('')
  const [urlFromCloud, setUrlFromCloud] = useState('')
  const history = useHistory()
  useEffect(() => {
    if (urlFromCloud) {
      fetch('/createpost', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          title,
          body,
          pic: urlFromCloud,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: '#c62828 red darken-3' })
          } else {
            M.toast({ html: data.good, classes: '#43a047 green darken-1' })
            history.push('/')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [urlFromCloud])
  // 上传一张照片到云
  const postDetails = () => {
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'insta-clone')
    data.append('cloud_name', 'wangyiuu')
    fetch('https://api.cloudinary.com/v1_1/wangyiuu/image/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      // 上传之后 返回一个obj 其中包含url 注意此data非彼data
      .then((data) => {
        // 获取云上的url照片
        setUrlFromCloud(data.url)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <div
      className='card input-field'
      style={{
        margin: '30px auto',
        maxWidth: '500px',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <input
        type='text'
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type='text'
        placeholder='Body'
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className='file-field input-field'>
        <div className='btn #64b5f6 blue darken-1'>
          <span>Upload Image</span>
          <input
            type='file'
            onChange={(e) => {
              setImage(e.target.files[0])
            }}
          />
        </div>
        <div className='file-path-wrapper'>
          <input
            className='file-path validate'
            type='text'
            placeholder='Upload one or more files'
          />
        </div>
      </div>
      <button
        className='btn waves-effect waves-light #64b5f6 blue darken-1'
        onClick={() => postDetails()}
      >
        Submit
      </button>
    </div>
  )
}

export default CreatePost
