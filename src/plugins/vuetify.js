import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import fr from 'vuetify/es5/locale/fr'
import i18n from '../i18n'

Vue.use(Vuetify, {
  iconfont: 'mdi',
  lang: {
    locales: { fr },
    current: 'fr',
    t: (key, ...params) => i18n.t(key, params)
  },
})
