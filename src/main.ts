import { createApp } from 'vue'
import App from './App.vue'
import { register } from 'register-service-worker'

const app = createApp(App).mount('#app');

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        updated() {
            // app is of type App
            (app as any).offerReload()
        }
    })
}
