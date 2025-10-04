<template>
    <v-tabs grow bg-color="grey-lighten-4" height="48" class="px-6 custom-tabs">
        <v-tab to="/dashboard">Dashboard</v-tab>
        <v-tab to="/ai">AI Demo</v-tab>
        <v-tab to="/settings">Settings</v-tab>
    </v-tabs>
</template>

<style>
.v-tab.v-tab--selected .v-tab__slider {
    border-bottom: 3px solid #43A047;
    border-radius: 0;
}
</style>
