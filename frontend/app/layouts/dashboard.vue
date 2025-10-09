<template>
  <v-app>
    <!-- Navbar -->
    <DashboardHeader />

    <!-- Main -->
    <v-main>
      <!-- Tabs section -->
      <DashboardTabNav />

      <!-- Page content -->
      <div class="content position-relative">
        <slot />
      </div>
    </v-main>

    <!-- Footer -->
    <DashboardFooter />
  </v-app>
</template>

<style scoped>
* {
  background-color: rgb(var(--v-theme-green-lighten-5));
}

.content {
  margin: 40px 160px 0 160px;
  padding: 0;
  /* background-color: ; */
}
</style>
