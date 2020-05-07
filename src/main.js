import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import element from './element-ui.config';
import { Elevator,SearchBar} from '@nutui/nutui';
import WebIM from './webim/WEbIM'

Elevator.install(Vue);
SearchBar.install(Vue);
Vue.use(element)
Vue.use(VueAxios,axios)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  WebIM,
  render: h => h(App)
}).$mount('#app')
