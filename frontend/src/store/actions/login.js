import router from "../../AppRoutes";
import { baseUrl } from "../../Consts";
import axios from "axios";
import { isResponseOk } from "../../layouts/auth/useLogin";

export async function login (store, logInData) {
	try {
		const data = { email: logInData.email, password: logInData.password }
		await axios.post(baseUrl + "login/", data, {
			withCredentials: true,
			headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": store.state.csrf,
			}
		})
		.then((res) => {
			isResponseOk(res)
			userInfo()
			store.setState({
			user: res.data.id
			})
		})
	} catch (error) {
		throw error
	}
}

const userInfo = () => {
    axios.get(baseUrl + "user_info/", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      console.log(res)
      console.log("Вы авторизованы как: " + res.data.id);
    })
    .catch((err) => {
        console.log(err.error);
    });
  }