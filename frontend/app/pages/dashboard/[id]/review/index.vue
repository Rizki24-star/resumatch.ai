<script setup lang="ts">
import resumePreview from "~/assets/images/resume-review.png";

const config = useRuntimeConfig();
const route = useRoute();
const puterStore = usePuterStore();

const id = route.params.id as string;
const feedback = ref<any>(null);
const resumeUrl = ref<string | null>(null);
const imageUrl = ref<string | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

useSeoMeta({
  title: "Resumind | Resume Review",
  description: "A detailed overview of your resume",
});

onMounted(async () => {
  try {
    console.log("Loading resume with id:", id);

    const response: any = await $fetch(`${config.public.apiBase}/${id}`, {
      method: "post",
      body: {
        user_id: "we787fy8sd8f7hd8s",
      },
    });

    const resume = response.data.feedback;

    console.log("Resume data:", resume);

    if (!resume) {
      error.value = "Resume not found";
      isLoading.value = false;
      return;
    }

    const data = resume;
    console.log("Parsed data:", data);

    const resumeBlob = await puterStore.read(data.resumePath);
    console.log("Resume blob:", resumeBlob);

    if (resumeBlob) {
      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      resumeUrl.value = URL.createObjectURL(pdfBlob);
    }

    const imageBlob = await puterStore.read(data.imagePath);
    console.log("Image blob:", imageBlob);

    if (imageBlob) {
      imageUrl.value = URL.createObjectURL(imageBlob);
    }

    feedback.value = data;
    console.log("Feedback:", feedback.value);
  } catch (err) {
    console.error("Error loading resume:", JSON.stringify(err));
    error.value = err instanceof Error ? err.message : "Failed to load resume";
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  if (resumeUrl.value) URL.revokeObjectURL(resumeUrl.value);
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value);
});

const getScoreColor = (score: number) => {
  if (score >= 70) return "green";
  if (score >= 50) return "orange";
  return "red";
};

const getTypeColor = (type: string) => {
  if (type == "good") return "green";
  if (type == "improve") return "orange";
  return "red";
};

const getTypeIcon = (type: string) => {
  if (type == "good") return "mdi-check-all";
  if (type >= "improve") return "mdi-alert";
  return "mdi-emoticon-sad";
};

const getScoreLabel = (score: number) => {
  if (score >= 70) return "Strong";
  if (score >= 50) return "Moderate";
  return "Weak";
};
</script>

<template>
  <v-app>
    <v-app-bar :elevation="0">
      <v-container class="d-flex align-center justify-space-between w-100">
        <v-btn variant="tonal" class="bg-black text-white" to="/dashboard">
          Back to Dashboard
        </v-btn>
        <a
          class="text-black text-h5 font-weight-bold text-decoration-none"
          href="/"
        >
          resumatch.ai
        </a>
      </v-container>
    </v-app-bar>

    <v-main class="content w-100 h-100">
      <v-row v-if="feedback">
        <!-- Resume preview -->
        <v-col cols="12" md="6">
          <div class="bg-white pa-4 h-100">
            <a :href="resumeUrl || '#'" target="_blank">
              <img
                :src="imageUrl || resumePreview"
                class="w-100 h-100"
                title="resume"
                style="object-fit: cover"
              />
            </a>
          </div>
        </v-col>

        <!-- Summary Result -->
        <v-col cols="12" md="6">
          <div class="d-flex flex-column ga-6 bg-white pa-8 h-100">
            <h4 class="text-h5 font-weight-bold">Resume Review</h4>

            <!-- Overall Score -->
            <div class="d-flex ga-4">
              <v-progress-circular
                :model-value="feedback.overallScore"
                :color="getScoreColor(feedback.overallScore)"
                :bg-color="`${getScoreColor(feedback.overallScore)}-lighten-4`"
                size="60"
                width="8"
                rounded
              >
                <span class="text-black">{{ feedback.overallScore }}%</span>
              </v-progress-circular>
              <div class="d-flex flex-column ga-1">
                <p class="text-h5 font-weight-bold">Your Resume Score</p>
                <span class="text-grey"
                  >This score is calculated based on the variables listed
                  below.</span
                >
              </div>
            </div>

            <!-- Summary Criteria List -->
            <div class="d-flex flex-column ga-4">
              <div
                class="border"
                v-for="(section, key) in feedback.sections"
                :key="key"
              >
                <v-container class="d-flex justify-space-between">
                  <div class="d-flex align-center ga-2">
                    <p class="text-h5 text-capitalize">
                      {{ String(key).replace("_", " & ") }}
                    </p>
                    <span
                      :class="`bg-${getScoreColor(section.score)}-lighten-5 text-${getScoreColor(section.score)} font-weight-medium rounded-pill px-3 py-1`"
                    >
                      {{ getScoreLabel(section.score) }}
                    </span>
                  </div>
                  <p class="text-h5">
                    <strong :class="`text-${getScoreColor(section.score)}`">{{
                      section.score
                    }}</strong
                    >/100
                  </p>
                </v-container>
              </div>
            </div>

            <!-- ATS Score Summary -->
            <div
              :class="`d-flex flex-column ga-3 bg-${getScoreColor(feedback.ATS.score)}-lighten-5 pa-6 rounded-lg`"
            >
              <p class="text-h5 font-weight-bold">
                ✅ ATS Score -
                <strong :class="`text-${getScoreColor(feedback.ATS.score)}`">{{
                  feedback.ATS.score
                }}</strong
                >/100
              </p>
              <p class="font-weight-bold text-h7">
                How well does your resume pass through Applicant Tracking
                Systems?
              </p>

              <div
                v-for="tip in feedback.ATS.tips"
                :key="tip"
                class="d-flex align-center ga-2"
              >
                <v-icon :color="getTypeColor(tip.type)">{{
                  getTypeIcon(tip.type)
                }}</v-icon>
                <p class="text-grey-darken-1">{{ tip.tip }}</p>
              </div>
            </div>

            <!-- Detailed Sections -->
            <v-expansion-panels :elevation="0">
              <!-- Tone & Style Section  -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <span class="font-weight-bold text-h6 text-capitalize"
                    >Tone & Style</span
                  >
                  <span
                    :class="`d-inline-flex align-center rounded-pill bg-${getScoreColor(feedback.toneAndStyle.score)}-lighten-5 px-1 py-0.5 text-black text-caption`"
                  >
                    <span
                      :class="`d-flex align-center justify-center rounded-circle bg-${getScoreColor(feedback.toneAndStyle.score)} pa-1 me-1`"
                      style="width: 20px; height: 20px"
                    >
                      <v-icon size="12" color="white">mdi-check</v-icon>
                    </span>
                    {{ feedback.toneAndStyle.score }}/100
                  </span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="d-flex flex-column ga-2">
                    <v-list
                      v-for="suggestion in feedback.toneAndStyle.tips"
                      :key="suggestion"
                    >
                      <div
                        :class="`bg-${getTypeColor(suggestion.type)}-lighten-5 pa-4 rounded-lg text-${getTypeColor(suggestion.type)}-darken-1`"
                      >
                        <div class="d-flex aligns-center ga-2 font-weight-bold">
                          <v-icon :color="getTypeColor(suggestion.type)">{{
                            getTypeIcon(suggestion.type)
                          }}</v-icon>
                          {{ suggestion.tip }}
                        </div>
                        <div>
                          {{ suggestion.explanation }}
                        </div>
                      </div>
                    </v-list>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Content Section  -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <span class="font-weight-bold text-h6 text-capitalize"
                    >Content</span
                  >
                  <span
                    :class="`d-inline-flex align-center rounded-pill bg-${getScoreColor(feedback.content.score)}-lighten-5 px-1 py-0.5 text-black text-caption`"
                  >
                    <span
                      :class="`d-flex align-center justify-center rounded-circle bg-${getScoreColor(feedback.content.score)} pa-1 me-1`"
                      style="width: 20px; height: 20px"
                    >
                      <v-icon size="12" color="white">mdi-check</v-icon>
                    </span>
                    {{ feedback.content.score }}/100
                  </span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="d-flex flex-column ga-2">
                    <v-list
                      v-for="suggestion in feedback.content.tips"
                      :key="suggestion"
                    >
                      <div
                        :class="`bg-${getTypeColor(suggestion.type)}-lighten-5 pa-4 rounded-lg text-${getTypeColor(suggestion.type)}-darken-1`"
                      >
                        <div class="d-flex aligns-center ga-2 font-weight-bold">
                          <v-icon :color="getTypeColor(suggestion.type)">{{
                            getTypeIcon(suggestion.type)
                          }}</v-icon>
                          {{ suggestion.tip }}
                        </div>
                        <div>
                          {{ suggestion.explanation }}
                        </div>
                      </div>
                    </v-list>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Structure Section  -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <span class="font-weight-bold text-h6 text-capitalize"
                    >Strucure</span
                  >
                  <span
                    :class="`d-inline-flex align-center rounded-pill bg-${getScoreColor(feedback.structure.score)}-lighten-5 px-1 py-0.5 text-black text-caption`"
                  >
                    <span
                      :class="`d-flex align-center justify-center rounded-circle bg-${getScoreColor(feedback.structure.score)} pa-1 me-1`"
                      style="width: 20px; height: 20px"
                    >
                      <v-icon size="12" color="white">mdi-check</v-icon>
                    </span>
                    {{ feedback.structure.score }}/100
                  </span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="d-flex flex-column ga-2">
                    <v-list
                      v-for="suggestion in feedback.structure.tips"
                      :key="suggestion"
                    >
                      <div
                        :class="`bg-${getTypeColor(suggestion.type)}-lighten-5 pa-4 rounded-lg text-${getTypeColor(suggestion.type)}-darken-1`"
                      >
                        <div class="d-flex aligns-center ga-2 font-weight-bold">
                          <v-icon :color="getTypeColor(suggestion.type)">{{
                            getTypeIcon(suggestion.type)
                          }}</v-icon>
                          {{ suggestion.tip }}
                        </div>
                        <div>
                          {{ suggestion.explanation }}
                        </div>
                      </div>
                    </v-list>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Skills Section  -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <span class="font-weight-bold text-h6 text-capitalize"
                    >Skills</span
                  >
                  <span
                    :class="`d-inline-flex align-center rounded-pill bg-${getScoreColor(feedback.skills.score)}-lighten-5 px-1 py-0.5 text-black text-caption`"
                  >
                    <span
                      :class="`d-flex align-center justify-center rounded-circle bg-${getScoreColor(feedback.skills.score)} pa-1 me-1`"
                      style="width: 20px; height: 20px"
                    >
                      <v-icon size="12" color="white">mdi-check</v-icon>
                    </span>
                    {{ feedback.skills.score }}/100
                  </span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="d-flex flex-column ga-2">
                    <v-list
                      v-for="suggestion in feedback.skills.tips"
                      :key="suggestion"
                    >
                      <div
                        :class="`bg-${getTypeColor(suggestion.type)}-lighten-5 pa-4 rounded-lg text-${getTypeColor(suggestion.type)}-darken-1`"
                      >
                        <div class="d-flex aligns-center ga-2 font-weight-bold">
                          <v-icon :color="getTypeColor(suggestion.type)">{{
                            getTypeIcon(suggestion.type)
                          }}</v-icon>
                          {{ suggestion.tip }}
                        </div>
                        <div>
                          {{ suggestion.explanation }}
                        </div>
                      </div>
                    </v-list>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-col>
      </v-row>

      <!-- Loading state -->
      <v-row v-else>
        <v-col
          cols="12"
          class="d-flex justify-center align-center"
          style="min-height: 400px"
        >
          <v-progress-circular
            color="green"
            :bg-color="`green-lighten-4`"
            indeterminate
            size="64"
          ></v-progress-circular>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<style scoped>
* {
  font-family: Inter;
}

.content {
  background-color: rgb(245, 250, 249);
}
</style>
