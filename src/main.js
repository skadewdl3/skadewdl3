import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { InstagramOutlined, GithubOutlined } from '@ant-design/icons-vue'

const app = createApp(App)

app.use(router)
app.component('icon-instagram', InstagramOutlined)
app.component('icon-github', GithubOutlined)
app.mount('#app')
