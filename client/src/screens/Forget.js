import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'

function Forget() {
  const history = useHistory()
  const [email, setEmail] = useState('')

  const PostData = () => {
    fetch('/forget', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
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
        console.log(err)
      })
  }

  return (
    <div className='mycard'>
      <div className='card auth-card input-field'>
        <h5>Send Verification Email</h5>
        <input
          type='text'
          placeholder='Email'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
        <button
          className='btn waves-effect waves-light #64b5f6 blue darken-1'
          onClick={() => PostData()}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Forget
