import React, { useReducer, createContext, useEffect } from 'react'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Profile from './screens/Profile'
import Navbar from './components/Navbar'
import './App.css'
import Signup from './screens/Signup'
import Login from './screens/Login'
import Home from './screens/Home'
import CreatePost from './screens/CreatePost'
import { reducer, initialState } from './reducers/UserReducer'
import { useContext } from 'react'
import UserProfile from './screens/UserProfile'
import PostsFromFollowings from './screens/PostsFromFollowings'
import Update from './screens/Update'
import Forget from './screens/Forget'
import Reset from './screens/Reset'
import SearchResult from './screens/SearchResult'
import Footer from './components/Footer'

// 要使用context, 就要使用reducer. Reducer 连接i到nitial state
// 首先Login会导入
export const UserContext = createContext()

// 分离Routing from App的原因是 为了使用 history  实现跳转
const Routing = () => {
  const history = useHistory()

  // 这一行是为了用户未退出，例如重启浏览器，从localstorage获取state信息
  const { dispatch } = useContext(UserContext)

  // 实现的是首次登陆的跳转
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    // 如果有locoalstorage 就是登陆了 去主页 反之就去Login
    if (user) {
      // 重启浏览器 有localstorage，但是没了state, 这里就得重新加载state
      dispatch({ type: 'USER', payload: user })
    } else {
      if (!history.location.pathname.startsWith('/reset'))
        history.push('/login')
    }
  }, [])
  return (
    <Switch>
      <Route path='/' exact>
        <Home />
      </Route>
      <Route exact path='/profile'>
        <Profile />
      </Route>
      <Route path='/signup'>
        <Signup />
      </Route>
      <Route path='/login'>
        <Login />
      </Route>
      <Route path='/createpost'>
        <CreatePost />
      </Route>
      <Route path='/profile/:userid'>
        <UserProfile />
      </Route>
      <Route path='/postsfromfollowings'>
        <PostsFromFollowings />
      </Route>
      <Route path='/update'>
        <Update />
      </Route>
      <Route path='/forget'>
        <Forget />
      </Route>
      <Route path='/reset/:token'>
        <Reset />
      </Route>
      <Route path='/search/:search'>
        <SearchResult />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        {console.log(state)}
        <Navbar />
        <main>
          <Routing />
        </main>

        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
