<script setup lang="ts">
const puterStore = usePuterStore()

onMounted(() => {
    puterStore.init()
})
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style>
* {
    font-family: Inter;
}
</style>
