import './App.css';
import'./Variables.css';
import React, { useState, useEffect } from "react";
import { RouterProvider } from 'react-router-dom';
import { baseUrl } from './Consts';
import axios from 'axios';
import router from './AppRoutes'
import useGlobal from './store';
import Icons from './icons/icons';



export const UserContext = React.createContext()

function App() {
  const [ globalState, globalActions ] = useGlobal();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
        getSession()
    }, [])

  const getSession = () => {
    axios.get(baseUrl + "session/", { withCredentials: true })
    .then((res) => {
      setLoading(false)
      if (res.data.isAuthenticated) {
          globalActions.changeState({user: res.data.user_id})
      } else {
        router.navigate('/login')
      }
      globalActions.getCsrf()
    })
    .catch(err => console.error(err))
  }


  return (
    loading ? (
      <div
      style={{justifyContent:"center", position:"absolute", margin:"auto", display:"flex", flexDirection:"column", alignItems:"center",
        top:"0", bottom:"0", right:"0", left:"0"
      }}>
        <Icons name="loading" className='rotate'/>
        <p>Загрузка</p>
      </div>
    ) : (
    <UserContext.Provider value={{ 
        user: globalState.user, setUser: setUser}}>
          <RouterProvider router={router}/>
      </UserContext.Provider>
    )
  );
}

export default App