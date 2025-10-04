<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Dashboard</h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Welcome back! Here's your overview.
        </p>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mt-4">
      <v-col cols="12" sm="6" md="3">
        <v-card color="primary" variant="elevated">
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-h4 font-weight-bold white--text">156</div>
                <div class="text-subtitle-2 white--text">Total Resumes</div>
              </div>
              <v-icon size="48" color="white" opacity="0.5">
                mdi-file-document
              </v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card color="success" variant="elevated">
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-h4 font-weight-bold white--text">24</div>
                <div class="text-subtitle-2 white--text">Active Jobs</div>
              </div>
              <v-icon size="48" color="white" opacity="0.5">
                mdi-briefcase
              </v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card color="info" variant="elevated">
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-h4 font-weight-bold white--text">89</div>
                <div class="text-subtitle-2 white--text">Matches Found</div>
              </div>
              <v-icon size="48" color="white" opacity="0.5">
                mdi-check-circle
              </v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card color="warning" variant="elevated">
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-h4 font-weight-bold white--text">78%</div>
                <div class="text-subtitle-2 white--text">Avg Match Score</div>
              </div>
              <v-icon size="48" color="white" opacity="0.5">
                mdi-chart-line
              </v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>Quick Actions</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="primary"
                  size="large"
                  prepend-icon="mdi-upload"
                  to="/resumes/upload"
                >
                  Upload Resume
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="success"
                  size="large"
                  prepend-icon="mdi-plus"
                  to="/jobs/create"
                >
                  Create Job
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="info"
                  size="large"
                  prepend-icon="mdi-file-document"
                  to="/resumes"
                >
                  View All Resumes
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="secondary"
                  size="large"
                  prepend-icon="mdi-briefcase"
                  to="/jobs"
                >
                  View All Jobs
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Activity -->
    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Recent Uploads</span>
            <v-btn size="small" variant="text" to="/resumes">
              View All
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list lines="two">
            <v-list-item
              v-for="i in 5"
              :key="i"
              prepend-avatar="https://i.pravatar.cc/150?img=1"
              title="John Doe"
              subtitle="Software Engineer • 5 years experience"
            >
              <template v-slot:append>
                <v-chip color="success" size="small">
                  <v-icon start>mdi-check</v-icon>
                  Analyzed
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Top Skills</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-chip
              v-for="skill in ['JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'Docker']"
              :key="skill"
              class="ma-1"
              color="primary"
              variant="outlined"
            >
              {{ skill }}
            </v-chip>
          </v-card-text>
        </v-card>

        <v-card class="mt-4">
          <v-card-title>System Status</v-card-title>
          <v-divider></v-divider>
          <v-list density="compact">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="success">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>Database</v-list-item-title>
              <v-list-item-subtitle>Connected</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="success">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>AI Service</v-list-item-title>
              <v-list-item-subtitle>Operational</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="success">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>Storage</v-list-item-title>
              <v-list-item-subtitle>78% Available</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
    const runtimeConfig = useRuntimeConfig()
</script>

<style>

</style>
