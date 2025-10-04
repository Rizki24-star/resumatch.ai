<template>
    <v-app>
        <!-- Navbar -->
        <DashboardHeader />

        <!-- Main -->
        <v-main>
            <!-- Tabs section -->
            <DashboardTabNav />

            <!-- Page content -->
            <v-container class="pa-6">
                <slot />
            </v-container>
        </v-main>

        <!-- Footer -->
        <DashboardFooter />
    </v-app>
</template>

<style scoped></style>
