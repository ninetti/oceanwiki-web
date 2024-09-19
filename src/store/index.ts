import create from '@ant-design/icons-vue/lib/components/IconFont';
import { createStore } from 'vuex'

declare let SessionStorage :any;
const USER = 'USER';
const store = createStore({
  state:{
    user:SessionStorage.get(USER)||{}
  },
  getters:{

  },
  mutations:{
    setUser(state,user){
      state.user = user;
      SessionStorage.set(USER,user);
    }
  },
  actions:{

  },
  modules:{

  }
})

export default store;