import Vue from 'vue'
import './plugins/fontawesome'
import App from './App.vue'
import router from './router'
import store from './store'
import AppButton from './components/AppButton'
import VueNativeStock from 'vue-native-websocket'

Vue.component('AppButton', AppButton)

Vue.use(VueNativeStock, 'ws://192.168.1.80:8080/websocket', {
  store,
  format: 'json',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  connectManually: false
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    this.$store.dispatch('INIT_BOARD')
  }
}).$mount('#app')
