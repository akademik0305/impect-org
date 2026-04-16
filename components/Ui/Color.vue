<script setup lang="ts">
//===============================-< set active color >-===============================
const colors = ["#01064f", "#4f39f6", "#2A9D8F", "#2563EB", "#10B981", "#F59E0B", "#E11D48" ];
const activeColor = ref(colors[0]);
//> variables
//> functions
function setActiveColor(color: string) {
	const rootElement = document.documentElement;
	rootElement.style.setProperty("--color-main", color);
	activeColor.value = color;
}
</script>
<template>
	<section
		class="fixed bottom-10 left-5 flex flex-col gap-2 bg-white shadow-md rounded-full p-2"
	>
		<button
			v-for="color in colors"
			:key="color"
			class="w-6 h-6 rounded-full flex items-center justify-center"
			:style="`background-color: ${color}`"
			@click="setActiveColor(color)"
		>
			<UIcon
				v-if="color === activeColor"
				name="material-symbols:check-rounded"
				class="text-xl text-white"
			/>
		</button>
	</section>
</template>
