import React, { useState } from 'react'
import M from 'materialize-css'
import { useParams } from 'react-router-dom'

const Reset = () => {
  // const history = useHistory();
  const [newPassword, setNewPassWord] = useState('')
  const { token } = useParams()

  const PostData = () => {
    fetch('/reset', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          return M.toast({ html: data.error, classes: '#e53935 red darken-1' })
        } else {
          M.toast({
            html: data.good,
            classes: '#43a047 green darken-1',
          })
        }
      })
      .catch((err) => {
        M.toast({ html: err.error, classes: '#e53935 red darken-1' })
      })
  }

  return (
    <div className='mycard'>
      <div className='card auth-card input-field'>
        <h4>Reset Password</h4>
        <input
          type='password'
          placeholder='New Password'
          value={newPassword}
          onChange={(e) => {
            setNewPassWord(e.target.value)
          }}
        />
        <button
          className='btn waves-effect waves-light #64b5f6 blue darken-1'
          onClick={() => PostData()}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default Reset
