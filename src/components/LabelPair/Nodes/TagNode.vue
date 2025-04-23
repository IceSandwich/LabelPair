<script setup lang="ts">
import NodeBase from '@/components/Panzoom/NodeBase.vue'
import { useTemplateRef } from 'vue';
import { TagNodeData } from './NodeType'

let inputs = defineProps<{
	nodeData: TagNodeData
}>();

const base = useTemplateRef("base");

function GetData() {
	return base.value.GetData();
}

function GetHTMLElem() {
	return base.value.GetHTMLElem();
}

function OnMouseDown(e: PointerEvent) {
	base.value.OnMouseDown(e);
}

function OnMouseMove(e: PointerEvent) {
	base.value.OnMouseMove(e);
}

function OnMouseUp(e: PointerEvent) {
	base.value.OnMouseUp(e);
}

function SetPanScale(scale: number) {
	base.value.SetPanScale(scale);
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

<template>
	<NodeBase :nodeData="inputs.nodeData" ref="base" style="width: 250px; float: left; position: relative;">
		<v-card class="mx-auto" prepend-icon="$vuetify" subtitle="The #1 Vue UI Library">
			<template v-slot:title>
				<span class="font-weight-black">{{  inputs.nodeData.label }}</span>
			</template>

			<v-card-text class="bg-surface-light pt-4">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est
				labore voluptatibus!
				Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum
				unde
				voluptatem!
			</v-card-text>
		</v-card>
	</NodeBase>
</template>