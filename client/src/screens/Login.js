import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../App'

function Login() {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { state, dispatch } = useContext(UserContext)

  const PostData = () => {
    fetch('/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      // 先把结果转为json, 再看做是data
      .then((res) => res.json())
      .then((data) => {
        // 测试用 前端浏览器中用这个
        // console.log(data);
        if (data.error) {
          return M.toast({ html: data.error, classes: '#e53935 red darken-1' })
        } else {
          // 后端返回的数据 包含token, user{_id, name, email}
          // 把信息存到localstorage里面。此时只可以是string
          localStorage.setItem('jwt', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          // 传递：{标签：USER， 数据：data.user}
          dispatch({ type: 'USER', payload: data.user })
          M.toast({
            html: data.good,
            classes: '#43a047 green darken-1',
          })
          history.push('/')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const quickLogin = () => {
    setEmail('test@test.com')
    setPassword('1234567')
  }

  return (
    <div className='mycard'>
      <div className='card auth-card input-field'>
        <h2>Instagram</h2>
        <input
          type='text'
          placeholder='Email'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <button
          className='btn waves-effect waves-light #64b5f6 blue darken-1'
          onClick={() => PostData()}
        >
          LOGIN
        </button>
        <h5>
          <Link to='/signup'>Don't have an account? Sign Up!</Link>
        </h5>
        <h6>
          <Link to='/forget'>Forget your password? Click here!</Link>
        </h6>
      </div>{' '}
      <button
        className='btn waves-effect waves-light #e040fb purple accent-2 center'
        style={{ display: 'block', margin: '0 auto' }}
        onClick={() => quickLogin()}
      >
        Login with a test account
      </button>
    </div>
  )
}

export default Login
