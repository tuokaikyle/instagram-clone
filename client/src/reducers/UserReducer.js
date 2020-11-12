export const initialState = null

export const reducer = (state, action) => {
  // 在login的时候用 把state变为user
  if (action.type === 'USER') {
    return action.payload
  }

  // 在logout 的时候用
  if (action.type === 'CLEAR') {
    return null
  }

  // 在点击follow, unfollow的时候用，name, email啥的不变，只有follower和following变
  // 此时，能不能值更新following?
  if (action.type === 'FOLLOW') {
    return {
      ...state,
      // followers: action.payload.followers,
      following: action.payload.following,
    }
  }
  if (action.type === 'UPDATE') {
    return {
      ...state,
      pic: action.payload.pic,
      name: action.payload.name,
      email: action.payload.email,
    }
  }
  if (action.type === 'SEARCH') {
    return {
      ...state,
      searchResults: action.payload,
    }
  }
  return state
}
