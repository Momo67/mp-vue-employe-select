import Vue from 'vue'
import '../plugins/vuetify'

import HelloWorld from './HelloWorld.vue'

// Vue.config.productionTip = false

export function install (Vue) {
  Vue.component('hello-world', HelloWorld)
}

export {
  HelloWorld
}

/* -- Plugin definition & Auto-install -- */
/* You shouldn't have to modify the code below */

// Plugin
const plugin = {
  install
}

export default plugin

// Auto-install
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}

if (GlobalVue) {
  GlobalVue.use(plugin)
}

new Vue({
  render: h => h(HelloWorld)
}).$mount('#app')
