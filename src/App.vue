<template>
	<v-app theme="PurpleTheme">
		<ModelDialog ref="modelDialog"></ModelDialog>

		<TopBar 
			:-tags-to-search="tagsToSearch" 
			:-status-label="statusLabel"
			@clicked-show-history="ShowHistoryDialog"
			@clicked-show-model="modelDialog.ShowDialog()"
			@on-select-searched-tag="onSelectSearchedTag"
		></TopBar>

		<v-main style="background: #eef2f6">
			<NodeContainer ref="canvas">
			</NodeContainer>
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import NodeContainer from '@/components/LabelPair/NodeContainer.vue';
import { TagNodeData } from '@/components/LabelPair/Nodes/NodeType';
import TopBar from '@/components/LabelPair/TopBar.vue';
import ModelDialog from '@/components/LabelPair/Dialogs/model.vue';
import { ref, useTemplateRef } from 'vue';

let canvas = useTemplateRef("canvas");

let statusLabel = ref("正在加载模型...");
let tagsToSearch = ref([
	"masterpiece",
	"best quality",
	"boy"
]);

function ShowHistoryDialog() {
	console.log("Add tag node");

	let tagNode = new TagNodeData();
	tagNode.label = "New tag";

	canvas.value.Append(tagNode);

}

const modelDialog = useTemplateRef('modelDialog');
function onSelectSearchedTag(value: string) {
	console.log("search tag: ", value);
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