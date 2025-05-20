import { login } from './login'
import { getCsrf } from './getCsrf'
import { logout } from "./logout"

async function changeState( store, states ) {
    store.setState( states );
}

export {
    changeState,
    login, 
    logout,
    getCsrf
}