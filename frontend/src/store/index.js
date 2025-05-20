import GlobalHook from "use-global-hook";
import * as actions from "./actions";


const initialState = {
  user: null,
  csrf: null
};

const useGlobal = GlobalHook( initialState, actions );

export default useGlobal;