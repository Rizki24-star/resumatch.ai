<script setup lang="ts">
import { ref } from "vue";

const showLoginModal = ref(false);

const { signIn, signOut, data } = useAuth();

const handleGoogleSignIn = () => {
  try {
    signIn("google");
  } catch (error) {
  } finally {
    showLoginModal.value = false;
  }
};

const features = [
  {
    icon: "mdi-flash",
    title: "Instant Analysis",
    description:
      "Get comprehensive resume analysis within seconds using cutting-edge AI",
  },
  {
    icon: "mdi-target",
    title: "Job Matching",
    description: "See how well your resume matches your target job description",
  },
  {
    icon: "mdi-chart-line",
    title: "Improvement Tips",
    description:
      "Specific and actionable recommendations to enhance your resume",
  },
  {
    icon: "mdi-file-document",
    title: "Detailed Scoring",
    description:
      "In-depth evaluation across multiple criteria important to recruiters",
  },
];

const stats = [
  { number: "50K+", label: "Resumes Analyzed" },
  { number: "95%", label: "Satisfaction Rate" },
  { number: "3x", label: "More Interviews" },
  { number: "24/7", label: "Platform Access" },
];

const benefits = [
  "Easy PDF resume upload",
  "Fast and accurate AI analysis",
  "Relevant keyword recommendations",
  "Job description compatibility scores",
  "Resume formatting and structure tips",
];

const steps = [
  "Upload your PDF resume",
  "Paste target job description",
  "Get analysis & recommendations",
];
</script>

<template>
  <div class="bg-white" style="min-height: 100vh">
    <!-- Navigation -->
    <v-app-bar fixed class="border-b" elevation="0" height="64">
      <v-container class="max-w-7xl pa-4">
        <v-row justify="space-between">
          <v-col cols="auto" class="d-flex align-center ga-2">
            <div
              class="w-8 h-8 bg-grey-darken-4 rounded-lg d-flex align-center justify-center"
            >
              <v-icon size="18" color="white">mdi-file-chart</v-icon>
            </div>
            <span class="text-h5 font-weight-bold text-black"
              >resumatch.<strong class="text-green">ai</strong></span
            >
          </v-col>

          <v-col cols="auto" class="d-flex align-center">
            <div v-if="data" class="d-flex aligns-center ga-2">
              <v-btn
                class="transform hover:scale-105 text-white bg-black"
                to="/dashboard"
              >
                Dashboard
              </v-btn>
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
            </div>

            <v-btn
              v-else
              color="green"
              class="green transform hover:scale-105"
              @click="showLoginModal = true"
            >
              Login
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- Hero Section -->
    <section class="pt-16 pb-16 pa-4">
      <v-container class="max-w-7xl">
        <v-row>
          <v-col cols="12" md="6">
            <div class="text-white mb-6">
              <div class="d-inline-block mb-4">
                <v-chip
                  color="green"
                  variant="outlined"
                  class="green-lighten-5 text-green"
                >
                  AI-Powered Resume Analysis
                </v-chip>
              </div>
              <h1
                class="text-h3 md:text-h2 font-weight-bold mb-4 text-grey-darken-4"
              >
                Optimize Your Resume with
                <span class="text-green-lighten-1">AI-Powered Analysis</span>
              </h1>
              <p class="text-h6 text-grey-darken-2 mb-6">
                Get detailed feedback, scoring, and job matching recommendations
                to land your dream job faster.
              </p>
              <div class="d-flex flex-column flex-sm-row ga-4">
                <v-btn
                  size="large"
                  color="green"
                  class="green transform hover:scale-105 shadow-lg"
                  prepend-icon="mdi-upload"
                  to="/dashboard"
                >
                  Upload Resume Now
                </v-btn>
                <v-btn
                  size="large"
                  variant="outlined"
                  color="green"
                  class="border-2"
                  to="/dashboard/analyzer"
                >
                  View Demo
                </v-btn>
              </div>

              <div class="d-flex align-center ga-1 mt-4">
                <v-icon
                  v-for="i in 5"
                  :key="i"
                  size="16"
                  color="orange"
                  class="mdi-star"
                  >mdi-check-star</v-icon
                >
              </div>
              <p class="text-caption text-grey-darken-1">
                Trusted by 50,000+ job seekers
              </p>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="relative">
              <v-card
                class="border border-lg backdrop-blur-sm shadow-2xl"
                rounded="xl"
                elevation="0"
              >
                <div class="green-lighten-4"></div>
                <div class="green-lighten-3"></div>

                <v-card-text class="pa-8">
                  <div class="mb-6">
                    <div
                      class="mb-6 d-flex justify-space-between align-center pa-4"
                    >
                      <span class="text-grey-darken-2 text-h5 font-weight-bold">
                        <v-icon color="green" size="30">mdi-file-chart</v-icon>
                        Match Score</span
                      >
                      <span
                        class="text-h4 font-weight-bold text-green-lighten-1"
                        >92%</span
                      >
                    </div>

                    <div class="mb-6">
                      <div
                        v-for="(item, idx) in [
                          'Tone & Style',
                          'Content',
                          'Structure',
                          'Skills',
                        ]"
                        :key="idx"
                        class="mb-4"
                      >
                        <div
                          class="d-flex justify-space-between text-caption mb-2"
                        >
                          <span class="text-grey-darken-1">{{ item }}</span>
                          <span class="text-green-lighten-1"
                            >{{ 95 - idx * 5 }}%</span
                          >
                        </div>
                        <v-progress-linear
                          :model-value="95 - idx * 5"
                          color="green"
                          height="8"
                          rounded
                          class="bg-grey-darken-2"
                        ></v-progress-linear>
                      </div>
                    </div>

                    <div class="green-lighten-5 rounded-lg">
                      <v-icon color="green">mdi-check-circle</v-icon>
                      <span
                        class="text-green-lighten-1 text-caption font-weight-medium"
                        >Your resume is ready to apply!</span
                      >
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Stats Section -->
    <section class="py-16 px-4 bg-green-lighten-5">
      <v-container class="max-w-7xl">
        <v-row>
          <v-col
            v-for="(stat, idx) in stats"
            :key="idx"
            cols="6"
            md="3"
            class="text-center"
          >
            <div
              class="text-h3 md:text-h2 font-weight-bold text-green-lighten-1 mb-2"
            >
              {{ stat.number }}
            </div>
            <div class="text-grey-darken-1">{{ stat.label }}</div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features Section -->
    <section id="features" class="pa-10">
      <v-container class="max-w-7xl">
        <div class="text-center mb-16">
          <h2
            class="text-h3 md:text-h2 font-weight-bold text-white mb-4 text-grey-darken-4"
          >
            Featured <span class="text-green-lighten-1">Features</span>
          </h2>
          <p
            class="text-h6 text-grey-lighten-1 text-center"
            style="max-width: 42rem; margin: 0 auto"
          >
            Cutting-edge AI technology for comprehensive resume analysis
          </p>
        </div>

        <v-row>
          <v-col
            v-for="(feature, idx) in features"
            :key="idx"
            cols="12"
            md="6"
            lg="3"
          >
            <v-card
              class="bg-green-lighten-5 backdrop-blur-sm transition-all transform hover:-translate-y-2 hover:shadow-xl pa-6"
              elevation="0"
              rounded="xl"
            >
              <div
                class="w-16 h-16 bg-white rounded-lg d-flex align-center justify-center mb-4"
              >
                <v-icon size="32" color="green">{{ feature.icon }}</v-icon>
              </div>
              <h3 class="text-h6 font-weight-medium text-black mb-2">
                {{ feature.title }}
              </h3>
              <p class="text-grey-darken-2">{{ feature.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Benefits Section -->
    <section id="benefits" class="pa-8 bg-grey-darken-2">
      <v-container class="max-w-7xl">
        <v-row>
          <v-col cols="12" md="6">
            <div class="mb-6">
              <h2 class="text-h3 md:text-h2 font-weight-bold text-white mb-4">
                Why Choose
                <span class="text-green-lighten-1">ResumeMatch AI?</span>
              </h2>
              <p class="text-h6 text-grey-lighten-1 mb-6">
                Our platform is designed specifically for modern job seekers who
                want to stand out in a competitive job market.
              </p>

              <div class="mb-6">
                <div
                  v-for="(benefit, idx) in benefits"
                  :key="idx"
                  class="d-flex align-start ga-3 mb-3"
                >
                  <v-icon color="green" size="24" class="flex-shrink-0 mt-1"
                    >mdi-check-circle</v-icon
                  >
                  <span class="text-grey-lighten-2">{{ benefit }}</span>
                </div>
              </div>

              <v-btn
                size="large"
                color="green"
                class="bg-gradient-to-r from-green to-green-darken-1 hover:from-green-darken-1 hover:to-green-darken-2 transform hover:scale-105 shadow-lg mt-6"
                prepend-icon="mdi-play"
              >
                Try Free Now
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              class="bg-grey-darken-4 backdrop-blur-sm"
              rounded="xl"
              elevation="0"
            >
              <v-card-text class="pa-8">
                <v-icon size="64" color="green" class="mb-6">mdi-upload</v-icon>
                <h3 class="text-h5 font-weight-bold text-white mb-4">
                  Upload & Analyze
                </h3>
                <p class="text-grey-lighten-1 mb-6">
                  Simple 3-step process to get comprehensive resume analysis
                </p>

                <div class="mb-6">
                  <div
                    v-for="(step, idx) in steps"
                    :key="idx"
                    class="d-flex align-center ga-4 mb-3"
                  >
                    <div class="green text-white rounded-circle">
                      {{ idx + 1 }}
                    </div>
                    <span class="text-grey-lighten-2">{{ step }}</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4">
      <v-container class="max-w-4xl">
        <v-card
          class="bg-green text-center relative overflow-hidden white--text"
          rounded="xl"
          elevation="0"
        >
          <v-card-text class="pa-12 position-relative" style="z-index: 10">
            <h2 class="text-h3 md:text-h2 font-weight-bold text-white mb-4">
              Ready to Improve Your Resume?
            </h2>
            <p
              class="text-h6 text-green-lighten-5 mb-8 text-center"
              style="max-width: 42rem; margin: 0 auto"
            >
              Join thousands of job seekers who have improved their chances with
              ResumeMatch AI
            </p>
            <v-btn
              size="large"
              color="white"
              variant="flat"
              class="text-green"
              to="/dashboard"
            >
              Start Free Analysis
            </v-btn>
          </v-card-text>
        </v-card>
      </v-container>
    </section>

    <!-- Footer -->
    <v-footer class="bg-grey-darken-4 py-12 px-4">
      <v-container class="max-w-7xl">
        <div class="text-center text-grey-lighten-1">
          <p>&copy; 2025 ResumeMatch AI. All rights reserved.</p>
        </div>
      </v-container>
    </v-footer>

    <!-- Login Modal -->
    <v-dialog v-model="showLoginModal" max-width="400" persistent>
      <v-card class="pa-6 rounded-xl" elevation="0">
        <v-card-title>
          <div class="d-flex align-center ga-2 justify-center">
            <span class="text-h5 font-weight-bold text-black">Sign in to </span>
            <span class="text-h5 font-weight-bold text-black"
              >resumatch.<strong class="text-green">ai</strong></span
            >
          </div>
        </v-card-title>
        <v-card-text class="text-center">
          <p class="text-grey-darken-1 mb-6">
            Continue with your Google account to access all features
          </p>
          <v-btn
            size="large"
            variant="outlined"
            class="w-full bg-grey-darken-4 text-white mb-4 d-flex align-center justify-space-between"
            @click="handleGoogleSignIn"
          >
            <v-icon size="24">mdi-google</v-icon>
            <span>Continue with Google</span>
          </v-btn>
          <p class="text-caption text-grey-darken-2">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn variant="text" @click="showLoginModal = false"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.max-w-7xl {
  max-width: 80rem;
}

.max-w-4xl {
  max-width: 56rem;
}

.max-w-2xl {
  max-width: 42rem;
}

.w-10 {
  width: 2.5rem;
}

.h-10 {
  height: 2.5rem;
}

.w-16 {
  width: 4rem;
}

.h-16 {
  height: 4rem;
}

.w-8 {
  width: 2rem;
}

.h-8 {
  height: 2rem;
}

.w-24 {
  width: 6rem;
}

.h-24 {
  height: 6rem;
}

.w-32 {
  width: 8rem;
}

.h-32 {
  height: 8rem;
}

.w-48 {
  width: 12rem;
}

.h-48 {
  height: 12rem;
}

.w-64 {
  width: 16rem;
}

.h-64 {
  height: 16rem;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.top-n4 {
  top: -1rem;
}

.right-n4 {
  right: -1rem;
}

.bottom-n4 {
  bottom: -1rem;
}

.left-n4 {
  left: -1rem;
}

.blur-2xl {
  filter: blur(40px);
}

.transform {
  transform: var(--tw-transform);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.rounded-circle {
  border-radius: 50%;
}

@media (max-width: 768px) {
  .md\:text-h2 {
    font-size: 2.25rem !important;
    font-weight: 700 !important;
    line-height: 2.5rem !important;
  }
}

@media (max-width: 640px) {
  .flex-sm-row {
    flex-direction: row !important;
  }
}
</style>
