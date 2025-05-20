import React, { useEffect } from "react";
import SideBar from "../components/sideBar";
import useGlobal from "../store";
import CustomButton from "../components/customButton";
import router from "../AppRoutes";

export default function Template({
    content = <div style={{display:"flex", flexDirection:"column", gap:"20px", margin:"auto", alignItems:"center"}}>
        <h2>Страница не найдена</h2>
        <CustomButton className="primary" text="На главную" onClick={() => router.navigate("/students", {replace:false})}/>
    </div>
}) {
    const [ globalState, globalActions ] = useGlobal();
    useEffect(() => {
        if (globalState.user == null) {
            content = "Вы не авторизованы"
        }
    }, [globalState.user])

    return (
        <div className="App">
            <SideBar/>
            {content}
        </div>
    )
}