import {createApp} from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import {loadFonts} from './plugins/webfontloader'
import router from './router'
import VueConfetti from 'vue-confetti'

loadFonts()

createApp(App).use(router).use(VueConfetti)
    .use(vuetify)
    .mount('#app')
