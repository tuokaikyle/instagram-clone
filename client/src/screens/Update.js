import React, { useState, useContext } from 'react'
import { useEffect } from 'react'
import { UserContext } from '../App'
import M from 'materialize-css'

// 逻辑
// 用户点击进入页面 输入栏通过localstorage填写
// 填入信息通过局部state保存 所以能实时展示
// 图片栏 默认的局部state为not updated
// 图片按钮 没有onclick 所以只是提供image
// 所以得通过useEffect监控：如果image有变化 则执行
// 在执行过程前后，设置局部state查看上传过程是否结束
// 未结束，则提交后端的按钮不显示
// 上传结束，则显示提交后端的按钮
// 如果image没有变化 则把pic的初始状态not updated传出去
// 在后端判断是否修改

const Update = () => {
  const { state, dispatch } = useContext(UserContext)

  const [nameNew, setNameNew] = useState(
    JSON.parse(localStorage.getItem('user')).name
  )
  const [emailNew, setEmailNew] = useState(
    JSON.parse(localStorage.getItem('user')).email
  )
  const [image, setImage] = useState('')
  const [pic, setPic] = useState('not updated')
  const [uploading, setUploading] = useState(false)

  const getUrl = (image) => {
    if (image) {
      setUploading(true)
      const data = new FormData()
      data.append('file', image)
      data.append('upload_preset', 'insta-clone')
      data.append('cloud_name', 'wangyiuu')
      fetch('https://api.cloudinary.com/v1_1/wangyiuu/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          setPic(res.url)
          setUploading(false)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  useEffect(() => {
    getUrl(image)
  }, [image])

  const submit = () => {
    fetch('/update', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({ name: nameNew, email: emailNew, pic }),
    })
      .then((res) => res.json())
      .then((res) => {
        dispatch({
          type: 'UPDATE',
          payload: {
            pic: res.result.pic,
            name: res.result.name,
            email: res.result.email,
          },
        })
        localStorage.setItem('user', JSON.stringify(res.result))
        M.toast({ html: res.good, classes: '#43a047 green darken-1' })
      })
      .catch((err) => {
        return M.toast({
          html: err,
          classes: '#e53935 red darken-1',
        })
      })
  }
  return (
    <>
      {state ? (
        <div className='mycard'>
          <div className='card auth-card input-field'>
            <h5>Edit</h5>
            <input
              type='text'
              placeholder='Name'
              value={nameNew}
              onChange={(e) => {
                setNameNew(e.target.value)
              }}
            />
            <input
              type='text'
              placeholder='Email'
              value={emailNew}
              onChange={(e) => {
                setEmailNew(e.target.value)
              }}
            />
            <div className='file-field input-field'>
              <div className='btn #64b5f6 blue darken-1'>
                <span>Upload New</span>
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
                  placeholder='Your current picture'
                />
              </div>
            </div>
            {uploading ? (
              <button className='btn waves-effect waves-light #64b5f6 yellow darken-1'>
                Uploading image...
              </button>
            ) : (
              <button
                className='btn waves-effect waves-light #64b5f6 blue darken-1'
                onClick={() => submit()}
              >
                Update
              </button>
            )}
          </div>
        </div>
      ) : (
        'Loading...'
      )}
    </>
  )
}

export default Update
