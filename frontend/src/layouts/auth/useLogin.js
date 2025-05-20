import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../Consts";
import axios from 'axios';
import { useContext } from "react";
import { UserContext } from "../../App";
import router from '../../AppRoutes'
import useGlobal from "../../store";


const isResponseOk = (res) => {
  if (!(res.status >= 200 && res.status <= 299)) {
    throw Error(res.statusText);
  }
}

const killAllSessions = () => {
  axios.get(baseUrl + "kill_all_sessions/", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    isResponseOk(res)
    console.log(res.data.detail)
  })
  .catch((err) => {
    console.log(err);
  });
}

export {
    isResponseOk
}