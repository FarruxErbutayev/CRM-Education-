import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from "naive-ui"
import PrimeVue from 'primevue/config';
import Button from "primevue/button"
import router from '../Pages';
import url from "../base/index"

import { createPinia } from 'pinia';
const pinia = createPinia()
window.url = (url)

const  app = createApp(App);
app.use(pinia)
app.use(naive);
app.use(PrimeVue, {theme: {
    // preset: Aura
}});

app.component('Button', Button);

app.use(router)
app.mount('#app')
