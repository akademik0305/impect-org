<script lang="ts" setup>
// props
const props = defineProps({
	placeholder: {
		type: String,
		default: 'Search...',
	},
})
// emits
const emit = defineEmits(['change-value'])
</script>
<template>
	<label
		for="search"
		class="flex items-center gap-4 bg-bg-soft py-2 px-3 rounded-xl border border-border transition-colors has-focus:border-main"
	>
		<!-- // -->
		<UIcon name="i-lucide-search" class="text-xl" />
		<input
			id="search"
			type="search"
			name="search"
			class="w-full text-text has"
			:placeholder="props.placeholder"
			@input="emit('change-value', $event.target)"
		/>
	</label>
</template>
