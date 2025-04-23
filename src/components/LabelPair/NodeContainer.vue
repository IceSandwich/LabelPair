<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import Container from '@/components/Panzoom/Container.vue';
import { PanzoomConfig, PZNodeDataType } from '@/components/Panzoom/Type';

const container = useTemplateRef("container");
let overlay = ref(false);
let config = new PanzoomConfig();

function onDragEnter(e: DragEvent) {
	e.preventDefault();
	e.stopPropagation();
	overlay.value = true;
}

function onDrop(e: DragEvent) {
	console.log("Drag", e.dataTransfer.files);
}

function onDragExit(e: DragEvent) {
	e.preventDefault();
	e.stopPropagation();
	overlay.value = false;
}

onMounted(() => {
	['dragenter', 'dragover'].forEach(eventName => {
		container.value.GetHTMLElem().addEventListener(eventName, onDragEnter);
	});
	['dragleave', 'dragexit', 'drop'].forEach(eventName => {
		container.value.GetHTMLElem().addEventListener(eventName, onDragExit);
	});
	container.value.GetHTMLElem().addEventListener("drop", onDrop);
})

onUnmounted(() => {
	const containerElem = container.value.GetHTMLElem();
	containerElem.removeEventListener("dragenter", onDragEnter);
	containerElem.removeEventListener("dragover", onDragEnter);
	containerElem.removeEventListener("dragleave", onDragExit);
	containerElem.removeEventListener("dragexit", onDragExit);
	containerElem.removeEventListener("drop", onDragExit);
	containerElem.removeEventListener("drop", onDrop);
})

function Append(node: PZNodeDataType) {
	container.value.Append(node);
}

defineExpose({
	Append
})

</script>

<template>
		<Container ref="container" :config="config">
			<template v-slot:header>
				<div class="shadow" v-bind:style="{'display': overlay ? 'block': 'none'}">
					<p>
						<v-icon icon="upload" size="large"></v-icon>
					</p>
					<p>
						Add images
					</p>
				</div>
			</template>
		</Container>
</template>

<style lang="css" scoped>
.shadow {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 2;
	cursor: grabbing;


	display: flex;
	flex-direction: column;
	align-content: center;
	justify-content: center;
	font-size: 23pt;
	color: lightgray;
	text-align: center;
	font-weight: bold;
}
</style>