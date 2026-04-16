<script setup lang="ts">
import type { PropType } from 'vue'
import type { TMeta } from '~/types/api.types'

// props
const props = defineProps({
	meta: {
		type: Object as PropType<TMeta>,
		required: true,
	},
	isShowSelect: {
		type: Boolean,
		default: false,
	},
})

//> emits
const emits = defineEmits(['change-page'])

//===============================-< handle change pagination >-===============================
//> variables
const page = ref(1)
//> functions
function handleChangePagination() {
	window.scrollTo(0, 0)
	emits('change-page', page.value)
}
</script>
<template>
	<div class="flex justify-end items-center p-3 border-t border-t-border">
		<UPagination
			v-model:page="page"
			color="warning"
			variant="outline"
			active-color="warning"
			size="md"
			:show-controls="true"
			:items-per-page="20"
			:total="props.meta.totalCount"
			@update:page="handleChangePagination"
		/>
	</div>
</template>
