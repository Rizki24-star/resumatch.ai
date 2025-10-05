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
    background-color: rgb(245, 250, 249);
}

.content {
    margin: 40px 160px 0 160px;
    padding: 0;
    /* background-color: ; */
}
</style>
