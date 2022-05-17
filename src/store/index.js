import { createStore } from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

//创建store对象
const state = {
  cartList: []
}

export default createStore({
  state,
  mutations,
  actions,
  getters,
  modules: {}
})
