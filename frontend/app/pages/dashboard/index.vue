<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["sidebase-auth"],
});

const { data: session } = useAuth();

const config = useRuntimeConfig();

const resumes = ref<any[]>([]);
const isLoading = ref(true);

const queueMessage = ref<string[]>([]);

const getScoreColor = (score: number) => {
  if (score >= 70) return "green";
  if (score >= 50) return "orange";
  return "red";
};

const formatDate = (timestamp: number) => {
  if (!timestamp) return "Recently";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const deleteResume = async (id: string) => {
  if (!confirm("Are you sure you want to delete this resume analysis?")) return;

  try {
    const token = session.value?.token;

    await $fetch(`${config.public.apiBase}/resume/${id}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    resumes.value = resumes.value.filter((r) => r._id !== id);
  } catch (error) {
    console.error("Error deleting resume:", error);
    alert("Failed to delete resume");
  }
};

const loadResumes = async () => {
  try {
    const token = session.value?.token;

    if (!token) {
      queueMessage.value.push("Not authenticated");
      return;
    }

    const res: any = await $fetch(
      `${config.public.apiBase}/resume/${session.value.user.id}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Success get resumes: ", res);

    if (!res.success) {
      queueMessage.value.push("Something wrong");
    }

    const keys = res.data;

    if (keys && Array.isArray(keys)) {
      resumes.value = keys
        .map((item: any) => item)
        .filter((r: any) => r !== null)
        .sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
    }
  } catch (error) {
    console.error("Error loading resumes:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadResumes();
});
</script>

<template>
  <div class="content">
    <h1>Welcome {{ session?.user?.name }}!</h1>
    <span class="text-grey">See the latest stats of your awesome resume.</span>
  </div>

  <v-container class="mt-6">
    <v-row v-if="isLoading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular
          indeterminate
          color="green"
          :bg-color="`green-lighten-4`"
          size="48"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="resumes.length === 0">
      <v-col cols="12">
        <v-card class="pa-8 text-center" elevation="0">
          <v-icon size="64" color="green">mdi-file-document-outline</v-icon>
          <p class="text-h6 mt-4 text-grey">No analyzed resumes yet</p>
          <p class="text-grey">Upload your first resume to get started</p>
          <v-btn class="mt-4" color="black" to="/dashboard/analyzer">
            Analyze Resume
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="resume in resumes" :key="resume.id" cols="12" md="6" lg="4">
        <v-card class="pa-4" hover>
          <div class="d-flex justify-space-between align-center mb-3">
            <h3 class="text-h6">{{ resume.jobTitle || "Untitled" }}</h3>
            <div class="d-flex ga-2 align-center">
              <v-chip
                :color="getScoreColor(resume.feedback?.overallScore || 0)"
                size="small"
              >
                {{ resume.feedback?.overallScore || 0 }}%
              </v-chip>
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="error"
                @click="deleteResume(resume.id)"
              >
              </v-btn>
            </div>
          </div>

          <p class="text-grey text-body-2 mb-2">{{ resume.companyName }}</p>

          <v-divider class="my-3"></v-divider>

          <div class="d-flex justify-space-between align-center">
            <span class="text-caption text-grey">
              {{ formatDate(resume.createdAt) }}
            </span>
            <v-btn
              :to="`/dashboard/${resume._id}/review`"
              variant="tonal"
              size="small"
            >
              View Details
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
