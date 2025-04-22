<template>
	<div ref="child" style="width: 250px; float: left; position: relative;">
	<v-card class="mx-auto" prepend-icon="$vuetify" subtitle="The #1 Vue UI Library">
		<template v-slot:title>
			<span class="font-weight-black">Welcome to Vuetify</span>
		</template>

		<v-card-text class="bg-surface-light pt-4">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est
			labore voluptatibus!
			Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum
			unde
			voluptatem!
		</v-card-text>
	</v-card>
	</div>
</template>

<script setup lang="ts">
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

const child = useTemplateRef('child');
let panzoom: PanzoomObject = null;

let isPanmode = false;
let requireNewStart = false;
let startX = 0, startY = 0;
let panX = 0, panY = 0;
let dx = 0, dy = 0;
let scale = 1;

function OnMouseDown(e: PointerEvent) {
	if (panzoom) {
		isPanmode = child.value.contains(e.target as Node);
		if (isPanmode) {
			console.log("child down")
			startX = e.clientX / scale;
			startY = e.clientY / scale;
			const {x, y} = panzoom.getPan();
			panX = x;
			panY = y;
			e.preventDefault();
		}
	}
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

function OnMouseWheel(e: WheelEvent) {
	if (panzoom) {
		console.log("child wheel")
		panzoom.zoomWithWheel(e);
	}
}

function SetPanScale(s: number) {
	if (isPanmode) {
		panzoom.pan(panX + dx, panY + dy);
		requireNewStart = true;
	}
	scale = s;
}


onMounted(() => {
	panzoom = Panzoom(child.value, {
		cursor: 'default',
		disablePan: false,
		zoomEnabled: true,
		noBind: true
	});
})


defineExpose({
	OnMouseDown,
	OnMouseMove,
	OnMouseUp,
	OnMouseWheel,
	SetPanScale,
})

</script>

