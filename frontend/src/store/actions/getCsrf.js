import axios from "axios"
import { baseUrl } from "../../Consts"
import { isResponseOk } from "../../layouts/auth/useLogin"

export async function getCsrf (store) {
    axios.get(baseUrl + 'csrf/', { withCredentials: true })
    .then((res) => {
        isResponseOk(res)
        const csrfToken = res.headers.get('X-CSRFToken')
        store.setState({csrf: csrfToken})
        return csrfToken
    })
    .catch((err) => console.error(err))
  }