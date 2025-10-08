<script setup lang="ts">
const puterStore = usePuterStore();

onMounted(() => {
  puterStore.init();
});
</script>

<template>
  <v-app>
    <v-main>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </v-main>
  </v-app>
</template>

<style>
* {
  font-family: Inter;
}
</style>
