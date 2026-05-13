<script lang="ts" setup>
// Bu barcha sahifalarda bo'ladi
// useHead({
//   script: [
//     {
//       type: 'application/ld+json',
//       children: JSON.stringify({
//         "@context": "https://schema.org",
//         "@type": "Organization",
//         "name": "Rivoj-98",
//       })
//     }
//   ]
// })
</script>
<template>
	<div class="wrapper site-surface flex min-h-screen flex-col">
		<BaseHeader />
		<div class="flex-1">
			<NuxtPage />
		</div>
		<BaseFooter />
	</div>
</template>
