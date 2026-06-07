import { createApp } from 'vue'
import "./assets/styles/index.scss"
import App from './App.vue'
import router from './router/router'
import { createPinia } from 'pinia';
import axios from 'axios'
const pinia = createPinia();
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'https://ural-muhomor.ru/api/' : '/api/';
createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')
