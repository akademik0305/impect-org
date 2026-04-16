<script setup lang="ts">

//===============================-< seo >-===============================
// useSeoMeta({
// 	title: 'Yangiliklar',
// })

//===============================-< imports >-===============================
//> store
//> utils
const colorMode = useColorMode()
//===============================-< on app load >-===============================
//> variables
//> functions
onMounted(() => {
	// AOS.init();
	colorMode.preference = 'light'
})



</script>
<template>
	<div>
		<NuxtRouteAnnouncer />
		<UApp :toaster="{ position: 'top-right', duration: 2000 }">
			<NuxtLayout />
		</UApp>
		<!-- <UiColor /> -->
	</div>
</template>
