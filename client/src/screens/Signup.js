import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useState } from 'react';
import M from 'materialize-css';
import { useEffect } from 'react';

function Signup() {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 只有这里是undefined，pic才会是undefined, 后端才会使用默认。''不行。但是有图标。null啥也没有。
  const [urlFromCloud, setUrlFromCloud] = useState(undefined);
  const [image, setImage] = useState('');

  // 情况一 没上传图片。此时点击-postData-allToBackEnd-pic是undefined
  // 情况二 上传图片。此时点击-postData-uploadImageGetUrl-fetch-url改变-useEffect-allToBackEnd

  // 这里uploadImageGetUrl需要时间，所以形成先后顺序，即url变化之后，再执行all
  useEffect(() => {
    if (urlFromCloud) {
      allToBackEnd();
    }
  }, [urlFromCloud]);

  // 上传image到云 获得一个url
  const uploadImageGetUrl = () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'insta-clone');
    data.append('cloud_name', 'wangyiuu');
    fetch('https://api.cloudinary.com/v1_1/wangyiuu/image/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrlFromCloud(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const allToBackEnd = () => {
    fetch('/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic: urlFromCloud,
      }),
    })
      // 先把结果转为json, 再看做是data
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          return M.toast({ html: data.error, classes: '#e53935 red darken-1' });
        } else {
          M.toast({ html: data.good, classes: '#43a047 green darken-1' });
          history.push('/login');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 把注册信息传给后端
  const PostData = () => {
    if (image) {
      uploadImageGetUrl();
    } else {
      allToBackEnd();
    }
  };

  return (
    <div className='mycard'>
      <div className='card auth-card input-field'>
        <h2>Instagram</h2>
        <input
          type='text'
          placeholder='Email'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <div className='file-field input-field'>
          <div className='btn #64b5f6 blue darken-1'>
            <span>Upload Image</span>
            <input
              type='file'
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
          </div>
          <div className='file-path-wrapper'>
            <input
              className='file-path validate'
              type='text'
              placeholder='Upload one file'
            />
          </div>
        </div>

        <button
          className='btn waves-effect waves-light #64b5f6 blue darken-1'
          onClick={() => PostData()}
        >
          Sign Up
        </button>
        <h5>
          <Link to='/login'>Already have an account? Login!</Link>
        </h5>
      </div>
    </div>
  );
}

export default Signup;
