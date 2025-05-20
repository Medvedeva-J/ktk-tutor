import axios from "axios";
import { baseUrl } from "../../Consts";
import { isResponseOk } from "../../layouts/auth/useLogin";
import router from "../../AppRoutes";

export async function logout (store) {
    axios.get(baseUrl + "logout", { withCredentials: true })
    .then((res) => {
      isResponseOk(res)
      store.actions.getCsrf()
      store.setState({
        user: null
      })
      router.navigate('/login')
    })
    .catch(err => console.error(err));
}