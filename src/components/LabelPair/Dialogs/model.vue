<template>
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
								<v-select label="Pretrained Model" :items="pretrainedModels"
									@update:model-value="onSelectedPretrainedModel"></v-select>
								<v-slider color="orange" label="Threads" prepend-icon="add" append-icon="remove"
									thumb-label :min="1" :max="8" :step="1" :model-value="4"></v-slider>
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
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showModelDialog = ref(true);

let pretrainedModels = [
	"SmalingWolf/wd-v1-4-convnextv2-tagger-v2"
]

function onSelectedPretrainedModel(value: string) {
	console.log("Selected pretrained model: ", value);
}

function ShowDialog() {
	showModelDialog.value = true;
}

defineExpose({
	ShowDialog
})

</script>