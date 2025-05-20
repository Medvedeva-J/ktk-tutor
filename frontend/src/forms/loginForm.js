import React, { useState } from "react";
import CustomButton from "../components/customButton";
import CustomInput from "../components/customInput";
import useGlobal from "../store";
import router from "../AppRoutes";
import { useFieldChange } from "../hooks/useFieldChange";

export default function LoginForm(props) {
  const [ globalState, globalActions ] = useGlobal();

  const [error, setError] = useState(null)
  const [logInData, setLogInData] = useState({email: "", password: ""})


  async function handleSubmit(e) {
      e.preventDefault()
      try {
        await globalActions.login(logInData)
        router.navigate("/students")
      } catch (e) {
        const err = await e
        setError(err.response.data.detail)
      }
  }

  const handleChange = useFieldChange(setLogInData)

  return(
    <form className="login-form">
        <h1 className="header1" style={{textAlign:"center"}}>Вход</h1>

        <CustomInput
        placeholder="E-mail" 
        type="text" 
        name="login" 
        id="login" 
        value={logInData.email}
        onChange={handleChange('email')}    
        />

        <CustomInput
        placeholder="Пароль"
        type="password" 
        name="password" 
        id="password" 
        value={logInData.password}
        onChange={handleChange('password')}  
        />

        <CustomButton className="primary" style={{justifyContent:"center", width:"400px"}} text='Войти' onClick={handleSubmit}  />

        { error? <p className="error body6">Ошибка входа</p>: null}
      </form>
  )
}
