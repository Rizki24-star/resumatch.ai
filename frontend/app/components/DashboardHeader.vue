<script setup lang="ts">
const { data, signOut } = useAuth();
</script>

<template>
  <nav app flat class="app-bar d-flex justify-space-between align-center">
    <div class="d-flex align-center gap-2">
      <a
        href="/"
        class="text-h5 font-weight-bold text-black text-decoration-none"
        >resumatch.<strong class="text-green">ai</strong></a
      >
    </div>

    <!-- User Avatar -->
    <v-menu>
      <template #activator="{ props }">
        <nuxt-img
          v-bind="props"
          v-if="data?.user?.image"
          :src="data.user.image"
          class="rounded-pill cursor-pointer"
          width="35"
          height="35"
        />
      </template>
      <v-card width="200" class="pa-2">
        <v-list density="compact">
          <v-list-item>
            <v-list-item-title class="text-body-2">{{
              data?.user?.name || "User"
            }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">{{
              data?.user?.email
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="my-2"></v-divider>
          <v-list-item @click="signOut" class="text-error">
            <template #prepend>
              <v-icon size="small">mdi-logout</v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </nav>
</template>

<style scoped>
.app-bar {
  margin: 0 160px 0 160px;
  padding: 15px 0 15px 0;
  background-color: #ffffff;
}
</style>
