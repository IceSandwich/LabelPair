<template>
	<v-app theme="PurpleTheme">
		<v-dialog max-width="500" v-model="showModelDialog">
			<v-card title="Model" prepend-icon="schema">
				<v-card-text>
					<v-container fluid>
						<v-row>
							<v-col>
								Use ai model to help you tag your images.
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<v-form>
									<v-select label="Pretrained Model" :items="pretrainedModels" @update:model-value="onSelectModel"></v-select>
									<v-slider color="orange" label="Threads" prepend-icon="add" append-icon="remove" thumb-label :min="1" :max="8" :step="1"></v-slider>
									<v-checkbox label="Warmup"></v-checkbox>
								</v-form>
							</v-col>
						</v-row>
						<v-row>
							<v-spacer></v-spacer>
							<v-btn class="bg-blue-darken-3 text-none" size="large">Initialize model</v-btn>
						</v-row>
							
					</v-container>
				</v-card-text>

				<!-- <v-card-actions>
					<v-spacer></v-spacer>

					<v-btn text="Close Dialog" @click="showModelDialog = false"></v-btn>
				</v-card-actions> -->
			</v-card>
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
				<v-btn prepend-icon="schema" class="text-none"
					@click="showModelDialog = true;">Model</v-btn>
			</v-toolbar-items>

			<v-spacer></v-spacer>

			<v-toolbar-items>
				<v-autocomplete append-inner-icon="search" label="Search" width="400" single-line hide-details :items="tagsToSearch" @update:model-value="onSearchTag">
				</v-autocomplete>
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
				<!-- <PanzoomNode>

				</PanzoomNode>
				<PanzoomNode>

				</PanzoomNode> -->
			</PanzoomContainer>
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import PanzoomContainer from '@/components/Panzoom/Container.vue';
import { ref } from 'vue';


const showModelDialog = ref(true);
let pretrainedModels = [
	"SmalingWolf/wd-v1-4-convnextv2-tagger-v2"
]
let tagsToSearch = [
	"masterpiece",
	"best quality",
	"boy"
]

function onSelectModel(value: string) {
	console.log("select model: ", value);
}

function onSearchTag(value: string) {
	if (value === null) return;
	console.log("search ", value);
}

</script>

<style lang="css" scoped>
.status_label {
	width: 300px;
	text-overflow: ellipsis;
	overflow: hidden;
	text-align: right;
}
</style>