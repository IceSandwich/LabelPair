<template>
	<v-app theme="PurpleTheme">
		<v-dialog max-width="500">
			<template v-slot:default="{ isActive: showModelDialog }">
				<v-card title="Dialog">
					<v-card-text>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
						labore et dolore magna aliqua.
					</v-card-text>

					<v-card-actions>
						<v-spacer></v-spacer>

						<v-btn text="Close Dialog" @click="showModelDialog.value = false"></v-btn>
					</v-card-actions>
				</v-card>
			</template>
		</v-dialog>


		<v-app-bar class="bg-purple-darken-4">
			<v-btn size="large" class="ms-3" prepend-icon="sell">
				<v-app-bar-title class="select">LabelPair</v-app-bar-title>
			</v-btn>

			<v-divider vertical inset class="ms-3"></v-divider>

			<v-toolbar-items variant="plain">
				<v-btn prepend-icon="download" class="text-none">Export</v-btn>
				<v-btn prepend-icon="trending_up" class="text-none">Analysis</v-btn>
				<v-btn prepend-icon="history" class="text-none">History</v-btn>
				<v-btn prepend-icon="schema" class="text-none" @click="showModelDialog = true; console.log(showModelDialog);">Model</v-btn>
			</v-toolbar-items>

			<v-spacer></v-spacer>

			<v-toolbar-items>
				<v-text-field append-inner-icon="search" label="Search" width="400" single-line hide-details>
				</v-text-field>
			</v-toolbar-items>

			<v-spacer></v-spacer>

			<v-toolbar-items variant="plain">
				<v-label>
					<div class="status_label">
						正在加载模型...
					</div>
				</v-label>

				<v-divider vertical inset class="ms-3"></v-divider>

				<v-btn class="text-none">
					<template v-slot:prepend>
						<v-icon>
							<img src="@/assets/octocat-logo.svg" style="width: 100%;">
						</v-icon>
					</template>
					Github
				</v-btn>
			</v-toolbar-items>

			<v-divider vertical class="ms-3"></v-divider>
		</v-app-bar>

		<v-main style="background: #eef2f6">
			<PanzoomContainer>
				<PanzoomNode>

				</PanzoomNode>
				<PanzoomNode>

				</PanzoomNode>
			</PanzoomContainer>
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import PanzoomContainer from '@/components/Panzoom/Container.vue';
import PanzoomNode from '@/components/Panzoom/Node.vue';
import { ref } from 'vue';


const showModelDialog = ref(false);

</script>

<style lang="css" scoped>
.status_label {
	width: 300px;
	text-overflow: ellipsis;
	overflow: hidden;
	text-align: right;
}
</style>

<!-- <script setup>
import { ref } from 'vue'

const drawer = ref(null)
</script>

<script>
export default {
	data: () => ({ drawer: null }),
}
</script> -->
