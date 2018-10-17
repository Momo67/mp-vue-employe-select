import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vue from 'vue'
import '../plugins/vuetify'

import EmployeSelect from './EmployeSelect.vue'

// Vue.config.productionTip = false

export function install (Vue) {
  Vue.component('employe-select', EmployeSelect)
}

export {
  EmployeSelect
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
  render: h => h(EmployeSelect)
}).$mount('#app')
