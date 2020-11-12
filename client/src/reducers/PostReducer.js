export const initialState = null

export const postReducer = (state, action) => {
  // 在login的时候用 把state变为user
  if (action.type === 'SEARCH') {
    return action.payload
  }

  return state
}
