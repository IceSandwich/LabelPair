<template>
	<div class="panzoom-container" ref="container">
		<slot name="header"></slot>

		<div class="panzoom-canvas" ref="canvas">
			<template v-for="item in renderingData">
				<component :is="item.nodeType" ref="childitems" :nodeData="item"></component>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * # Container
 * Must register your nodes in `main.js`. It won't have any errors if you don't do that.
 * ``` typescript
 * import App from './App.vue'
 * import TagNode from "./components/LabelPair/TagNode.vue";
 * 
 * const app = createApp(App)
 * app.component("TagNode", TagNode); // here
 * ```
 */


import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { onMounted, onUnmounted, Ref, ref, ShallowRef, useTemplateRef } from 'vue';
import { PanzoomConfig, PZNodeDataType, PZNodeType } from './Type';

const container = useTemplateRef("container");
const canvas = useTemplateRef("canvas");
const childrens = useTemplateRef("childitems") as Readonly<ShallowRef<PZNodeType[]>>;

let renderingData: Ref<PZNodeDataType[]> = ref([]);

function Append(node: PZNodeDataType) {
	console.log("Append ", node);
	let val = renderingData.value;
	val.push(node);
	renderingData.value = val;
	console.log("===", renderingData.value)
}

function GetHTMLElem() {
	return container.value;
}

defineExpose({
	Append,
	GetHTMLElem
})

let props = defineProps<{
	config: PanzoomConfig
}>();

enum Status {
	DisablePan,
	PanCanvas,
	PanChildren,
}
let status = Status.DisablePan;

let panzoom: PanzoomObject = null;
let panChild: PZNodeType = null;

function onMouseDown(e: PointerEvent) {
	if (e.button === props.config.button) {
		console.log("container mouse down");

		// reset scales
		childrens.value?.forEach((item) => item.SetPanScale(panzoom.getScale()));

		// decide to pan a child object
		panChild = childrens.value?.find((item) => item.GetHTMLElem().contains(e.target as Node));

		if (panChild) {
			status = Status.PanChildren;
			panChild.OnMouseDown(e);
		} else {
			panChild = null; // find() return undefined but i want it null
			status = Status.PanCanvas;
			panzoom.handleDown(e);
		}
	}
	e.preventDefault();
	e.stopPropagation();
}

function onMouseMove(e: PointerEvent) {
	if (status != Status.DisablePan) {
		console.log("container mouse move");
		if (status == Status.PanChildren) {
			panChild.OnMouseMove(e);
		}else {
			panzoom.handleMove(e);
		}
	}
	e.preventDefault();
	e.stopPropagation();
}

function onMouseUp(e: PointerEvent) {
	if (status != Status.DisablePan) {
		console.log("container mouse up");
		if (status == Status.PanChildren) {
			panChild.OnMouseUp(e);
		} else {
			panzoom.handleUp(e);
		}
		status = Status.DisablePan;
	}
	e.preventDefault();
	e.stopPropagation();
}

function onMouseWheel(e: WheelEvent): void {
	console.log("container mouse wheel");
	panzoom.zoomWithWheel(e);
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
})

onUnmounted(() => {
	container.value?.removeEventListener("pointerdown", onMouseDown);
	container.value?.removeEventListener("pointermove", onMouseMove);
	container.value?.removeEventListener("pointerup", onMouseUp);
	container.value?.removeEventListener("pointerleave", onMouseUp);
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
</style>