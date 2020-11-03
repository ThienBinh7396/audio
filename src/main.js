import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import './plugins/components';

import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
Vue.use(PerfectScrollbar);




import Axios from 'axios'
Vue.prototype.$axios = Axios.create({
    //baseURL: 'https://audio-sleepy-bilby.mybluemix.net/api/'
    // baseURL: 'http://localhost:7000/api/'
    baseURL: '/api/'
    //baseURL: 'https://planet-case.glitch.me/api/'
        //baseURL: 'https://brindle-macadamia.glitch.me/api/'
});


import 'hooper/dist/hooper.css';
import '@/assets/css/main.css';

import '@/assets/css/animation.css';


import router from './router'

import store from './store'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')