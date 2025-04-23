<template>
	<v-app-bar class="bg-purple-darken-4">
		<v-btn size="large" class="ms-3" prepend-icon="sell">
			<v-app-bar-title class="select">LabelPair</v-app-bar-title>
		</v-btn>

		<v-divider vertical inset class="ms-3"></v-divider>

		<v-toolbar-items variant="plain">
			<v-btn prepend-icon="download" class="text-none" @click="$emit('ClickedExport')">Export</v-btn>
			<v-btn prepend-icon="trending_up" class="text-none" @click="$emit('ClickedAnalysis')">Analysis</v-btn>
			<v-btn prepend-icon="history" class="text-none" @click="$emit('ClickedShowHistory')">History</v-btn>
			<v-btn prepend-icon="schema" class="text-none" @click="$emit('ClickedShowModel')">Model</v-btn>
		</v-toolbar-items>

		<v-spacer></v-spacer>

		<v-toolbar-items>
			<v-autocomplete append-inner-icon="search" label="Search" width="400" single-line hide-details
				:items="$props.TagsToSearch" @update:model-value="(value) => $emit('OnSelectSearchedTag', value)">
			</v-autocomplete>
		</v-toolbar-items>

		<v-spacer></v-spacer>

		<v-toolbar-items variant="plain">
			<v-label>
				<div class="status_label">
					{{  $props.StatusLabel }}
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
</template>

<script setup lang="ts">
const props = defineProps<{
	StatusLabel: string
	TagsToSearch: string[]
}>();

defineEmits<{
	ClickedExport: [],
	ClickedAnalysis: [],
	ClickedShowModel: [],
	ClickedShowHistory: [],
	OnSelectSearchedTag: [tag: string]
}>()

</script>