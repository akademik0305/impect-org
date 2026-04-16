<script setup lang="ts">
//=============================-< imports >-=================================
import type { PropType } from "vue";
// import { useI18n } from "vue-i18n";
//> useful
// const { t } = useI18n();
//=============================- props -=================================
//variables
const props = defineProps({
	type: {
		type: String as PropType<"main" | "success" | "error">,
		default: "main",
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
	text: {
		type: String,
		required: true,
	},
	isFull: {
		type: Boolean,
		defualt: true,
	},
});

const loadingText = ref("Yuklanmoqda");
onMounted(() => {});
</script>

<template>
	<button
		class="relative flex h-auto py-2 px-4 border rounded-md items-center justify-center overflow-hidden font-medium text-white shadow-2xl transition-all duration-300 before:absolute before:inset-0 before:border-0 before:border-white before:duration-100 before:ease-linear hover:bg-white hover:text-main hover:before:border-[25px]"
		:class="[
			isFull ? ' w-full' : 'w-52',
			{
				'bg-main border-main hover:text-main hover:shadow-main hover:border-main':
					props.type === 'main',
			},
			{ 'bg-green border-green hover:text-green': props.type === 'success' },
			{ 'bg-red border-red hover:text-red': props.type === 'error' },
		]"
	>
		<slot />
		<Icon
			v-if="isLoading"
			name="line-md:loading-twotone-loop"
			class="w-6 h-6"
		/>
		<span class="text-md leading-6 relative z-10">
			{{ props.isLoading ? loadingText : props.text }}
		</span>
	</button>
</template>
