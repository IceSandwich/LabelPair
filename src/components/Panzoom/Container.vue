<template>
	<div class="panzoom-container" ref="container">
		<div class="shadow" v-bind:style="{'display': overlay ? 'block': 'none'}">
			<p>
				<v-icon icon="upload" size="large"></v-icon>
			</p>
			<p>
				Add images
			</p>
		</div>

		<div class="panzoom-canvas" ref="canvas">
			<!-- <slot ref="slotRef">
				<Node></Node>
			</slot> -->
			<PZNode ref="nodeA"></PZNode>
			<PZNode ref="nodeB"></PZNode>
			
		</div>

	</div>
</template>

<script setup lang="ts">
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import PZNode from './PZNode.vue'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

const nodeA = useTemplateRef("nodeA");
const nodeB = useTemplateRef("nodeB");
const container = useTemplateRef("container");
const canvas = useTemplateRef("canvas");
let overlay = ref(false);

let panzoom: PanzoomObject = null;
let panMouseButton = 0; //左键
let onPanMode = 0; // 0 to disable pan, 1 to pan all, 2 to pan children

function onMouseDown(e: PointerEvent): void {
	if (e.button === panMouseButton) {
		console.log("container mouse down");
		if (canvas.value.contains(e.target as Node)) {
			nodeA.value.OnMouseDown(e);
			nodeB.value.OnMouseDown(e);
			onPanMode = 2;
		} else {
			panzoom.handleDown(e);
			onPanMode = 1;
			e.preventDefault()
		}
	}
}
function onMouseMove(e: PointerEvent): void {
	if (onPanMode > 0) {
		console.log("container mouse move");
		if (onPanMode == 2) {
			nodeA.value.OnMouseMove(e);
			nodeB.value.OnMouseMove(e);
		} else {
			panzoom.handleMove(e);
			e.preventDefault()
		}
	}
}
function onMouseUp(e: PointerEvent): void {
	if (onPanMode > 0) {
		console.log("container mouse up");
		if (onPanMode == 2) {
			nodeA.value.OnMouseUp(e);
			nodeB.value.OnMouseUp(e);
		} else {
			panzoom.handleUp(e);
			e.preventDefault()
		}
		onPanMode = 0;
	}
}

function onMouseWheel(e: WheelEvent): void {
	console.log("container mouse wheel");
	panzoom.zoomWithWheel(e);
	nodeA.value.SetPanScale(panzoom.getScale());
	nodeB.value.SetPanScale(panzoom.getScale());
}

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
	panzoom = Panzoom(canvas.value, {
		cursor: 'default',
		zoomSpeed: 0.065,
		minZoom: 0.03,
		maxZoom: 5,
		noBind: true
	});

	container.value.addEventListener("pointerdown", onMouseDown);
	container.value.addEventListener("pointermove", onMouseMove);
	container.value.addEventListener("pointerup", onMouseUp);
	container.value.addEventListener("pointerleave", onMouseUp);
	container.value.addEventListener('wheel', onMouseWheel);

	['dragenter', 'dragover'].forEach(eventName => {
		container.value.addEventListener(eventName, onDragEnter);
	});
	['dragleave', 'dragexit', 'drop'].forEach(eventName => {
		container.value.addEventListener(eventName, onDragExit);
	});
	container.value.addEventListener("drop", onDrop);
})

onUnmounted(() => {
	container.value?.removeEventListener("pointerdown", onMouseDown);
	container.value?.removeEventListener("pointermove", onMouseMove);
	container.value?.removeEventListener("pointerup", onMouseUp);
	container.value?.removeEventListener("pointerleave", onMouseUp);

	container.value?.removeEventListener("dragenter", onDragEnter);
	container.value?.removeEventListener("dragover", onDragEnter);
	container.value?.removeEventListener("dragleave", onDragExit);
	container.value?.removeEventListener("dragexit", onDragExit);
	container.value?.removeEventListener("drop", onDragExit);
	container.value?.removeEventListener("drop", onDrop);
})
</script>

<style lang="css" scoped>
.panzoom-container {
	width: 100%;
	height: 100%;
}

.panzoom-canvas {
	overflow: visible !important;
}

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