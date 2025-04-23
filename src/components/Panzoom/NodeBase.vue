<template>
	<div ref="child" :style="inputs.style">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { onMounted, onUnmounted, StyleValue, useTemplateRef } from 'vue';
import { PZNodeDataType } from './Type';

const child = useTemplateRef("child");
let panzoom: PanzoomObject = null;

onMounted(() => {
	panzoom = Panzoom(child.value, {
		cursor: 'default',
		disablePan: false,
		zoomEnabled: false,
		noBind: true
	});
});

onUnmounted(() => {
	panzoom.destroy();
});

let inputs = defineProps<{
	nodeData: PZNodeDataType
	style: StyleValue
}>();
let isPanmode = false;
let startX = 0, startY = 0;
let panX = 0, panY = 0;
let dx = 0, dy = 0;
let scale = 1;
let requireNewStart = false;

function OnMouseDown(e: PointerEvent) {
	startX = e.clientX / scale;
	startY = e.clientY / scale;
	const {x, y} = panzoom.getPan();
	panX = x;
	panY = y;
	isPanmode = true;
}

function OnMouseMove(e: PointerEvent) {
	if (isPanmode) {
		console.log("child move")
		if (requireNewStart === true) {
			startX = e.clientX / scale;
			startY = e.clientY / scale;
			const {x, y} = panzoom.getPan();
			panX = x;
			panY = y;
			requireNewStart = false;
		}
		dx = e.clientX / scale - startX
		dy = e.clientY / scale - startY
		panzoom.pan(panX + dx, panY + dy);
	}
}

function OnMouseUp(e: PointerEvent) {
	if (isPanmode) {
		console.log("child up")
		dx = e.clientX / scale - startX
		dy = e.clientY / scale - startY
		panzoom.pan(panX + dx, panY + dy);
		isPanmode = false;
	}
}

function SetPanScale(s: number) {
	if (isPanmode) {
		panzoom.pan(panX + dx, panY + dy);
		requireNewStart = true;
	}
	scale = s;
}

function GetData() {
	return inputs.nodeData;
}

function GetHTMLElem() {
	return child.value;
}

defineExpose({
	GetData,
	GetHTMLElem,

	OnMouseDown,
	OnMouseMove,
	OnMouseUp,

	SetPanScale,
});

</script>