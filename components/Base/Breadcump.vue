<script lang="ts" setup>
import type { PropType } from 'vue'

const localePath = useLocalePath();
type TLinks = {
	label: string
	url?: string
}[]

const props = defineProps({
	links: {
		type: Array as PropType<TLinks>,
		required: true,
	},
})
</script>
<template>
	<div class="flex items-center justify-start gap-2 mt-2">
		<div
			v-for="(link, index) in props.links"
			:key="link.label"
			class="flex items-center justify-start gap-2"
		>
			<NuxtLink
				:to="localePath(link.url || '/')"
				class="text-sm text-subtext"
				:class="[
					link.url ? 'hover:text-main transition-colors duration-300' : '',
				]"
			>
				{{ link.label }}
			</NuxtLink>
			<span
				v-if="index + 1 !== props.links?.length"
				class="text-sm text-subtext"
				>/</span
			>
		</div>
	</div>
</template>
