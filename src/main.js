import Vue from 'vue'
import './plugins/axios'
import './plugins/vuetify'
import App from './App.vue'
// import HelloI18n from './components/HelloI18n.vue'
import i18n from './i18n'

Vue.config.productionTip = false

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
