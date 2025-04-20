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
			<slot ref="slotRef">

			</slot>
		</div>
	</div>
</template>

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

<script setup lang="ts">
import Panzoom from '@panzoom/panzoom';
import { onMounted, ref } from 'vue';

let overlay = ref(false);

let panMouseButton = 0; //左键

const container = ref(null);
const canvas = ref(null);
const slotRef = ref(null);

onMounted(() => {
	const panzoom = Panzoom(canvas.value, {
		cursor: 'default',
		zoomSpeed: 0.065,
		minZoom: 0.03,
		maxZoom: 5,
		noBind: true
	});

	const handleMouseDown = (e: PointerEvent) => {
		console.log("down....")
		if (e.button === panMouseButton) {
			if (canvas.value.contains(e.target) === false) {
				panzoom.handleDown(e);
				e.preventDefault()
			} else {
				slotRef.value.handleMouseDown(e);
			}
		}
	}

	const handleMouseMove = (e: PointerEvent) => {
		console.log("move....")
		panzoom.handleMove(e);
		e.preventDefault()
	}

	const handleMouseUp = (e: PointerEvent) => {
		console.log("up....")
		if (e.button === panMouseButton) {
			if (canvas.value.contains(e.target) === false) {
				panzoom.handleUp(e);
				e.preventDefault()
			} else {
				slotRef.value.handleMouseDown(e);
			}
		}
	}

	const handleDrop = (e: DragEvent) => {
		console.log("Drag", e.dataTransfer.files);
	}

	const containerElement: HTMLElement = container.value;
	containerElement.addEventListener('wheel', panzoom.zoomWithWheel);
	containerElement.addEventListener("pointerdown", handleMouseDown);
	containerElement.addEventListener("pointermove", handleMouseMove);
	containerElement.addEventListener("pointerup", handleMouseUp);
	containerElement.addEventListener("pointerleave", handleMouseUp);

	['dragenter', 'dragover'].forEach(eventName => {
		containerElement.addEventListener(eventName, e => {
			e.preventDefault();
			e.stopPropagation();
			overlay.value = true;
		});
	});
	['dragleave', 'dragexit', 'drop'].forEach(eventName => {
		containerElement.addEventListener(eventName, e => {
			e.preventDefault();
			e.stopPropagation();
			overlay.value = false;
		});
	});
	containerElement.addEventListener("drop", handleDrop);

})

</script>