import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'

const Searchbox = () => {
  const history = useHistory()
  const [search, setSearch] = useState('')
  const { state, dispatch } = useContext(UserContext)

  const submitHandler = (e) => {
    e.preventDefault()
    fetch(`/search?search=${search}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        dispatch({ type: 'SEARCH', payload: res })
        setSearch('')
      })
      .then((res) => {
        history.push(`/search/${search}`)
      })
  }
  return (
    <form onSubmit={submitHandler}>
      {' '}
      <input
        id='search'
        type='search'
        placeholder='Search'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
        }}
      />
    </form>
  )
}

export default Searchbox
