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
import { onMounted, ref } from 'vue';

const child = ref(null);
let panzoom: PanzoomObject = null;

onMounted(() => {
	panzoom = Panzoom(child.value, {
		cursor: 'default',
		disablePan: true,
		zoomEnabled: false,
		noBind: true
	});
})

function handleMouseDown(e: PointerEvent) {
	if (panzoom) {
		console.log("child down")
		panzoom.handleDown(e);
	}
}

function handleMouseMove(e: PointerEvent) {
	if (panzoom) {
		console.log("child move")
		panzoom.handleMove(e);
	}
}

function handleMouseUp(e: PointerEvent) {
	if (panzoom) {
		console.log("child up")
		panzoom.handleUp(e);
	}
}

defineExpose({
	handleMouseDown,
	handleMouseMove,
	handleMouseUp,
})
</script>

