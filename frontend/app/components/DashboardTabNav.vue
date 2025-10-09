<template>
    <v-tabs bg-color="" height="48" class="nav-tab">
        <v-tab to="/dashboard">
            <v-icon class="me-2">mdi-view-dashboard</v-icon>
            Dashboard
        </v-tab>
        <v-tab to="/dashboard/analyzer">
            <v-icon class="me-2">mdi-brain</v-icon>
            AI Demo
        </v-tab>
    </v-tabs>
</template>

<style>
.nav-tab {
    margin: 20px 160px 0 160px;
}

.v-tab.v-tab--selected .v-tab__slider {
    border-bottom: 3px solid #43A047;
    border-radius: 0;
}
</style>
