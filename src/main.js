// import './assets/main.css'
import "material-design-icons-iconfont/dist/material-design-icons.css"; // Ensure your project is capable of handling css files

import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, md } from "vuetify/iconsets/md";
import { PurpleTheme } from './theme/LightTheme';

// Components
import App from './App.vue'
import TagNode from "./components/LabelPair/Nodes/TagNode.vue";

const vuetify = createVuetify({
	components,
	directives,
	icons: {
		defaultSet: "md",
		aliases,
		sets: {
			md,
		},
	},
	theme: {
		defaultTheme: 'PurpleTheme',
		themes: {
			PurpleTheme
		}
	}
})

const app = createApp(App)
app.use(vuetify)

app.component("TagNode", TagNode);

app.mount('#app')

