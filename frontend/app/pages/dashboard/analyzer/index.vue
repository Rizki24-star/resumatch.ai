<script setup lang="ts">
import { ref, computed } from "vue";
import IcimageScanning from "~/assets/images/ic-document-scanning2.gif";

definePageMeta({
  layout: "dashboard",
  middleware: "sidebase-auth",
});

const { data: session } = useAuth();
const config = useRuntimeConfig();
const router = useRouter();

const formRef = ref<HTMLFormElement | null>(null);
const isFormValid = ref(false);

const companyName = ref("");
const jobTitle = ref("");
const jobDescription = ref("");

const statusText = ref("");
const isFailed = ref(false);
const isProcessing = ref(false);

const resumeFile = ref<File | null | undefined>(null);

const queueMessage = ref<string[]>([]);

const fileDisplayInfo = computed(() => {
  if (resumeFile.value) {
    const name = resumeFile.value.name;
    const sizeMB = (resumeFile.value.size / (1024 * 1024)).toFixed(2);
    return `${name} (${sizeMB} MB)`;
  }
  return "Resume upload";
});

// Validation Rules
const companyNameRules = [
  (v: string) => !!v || "Company name is required",
  (v: string) => v.length >= 2 || "Min 2 characters",
];

const jobTitleRules = [
  (v: string) => !!v || "Job title is required",
  (v: string) => v.length >= 2 || "Min 2 characters",
];

const jobDescriptionRules = [
  (v: string) => !!v || "Job description is required",
  (v: string) => v.length >= 10 || "Min 10 characters",
];

const resumeFileRules = [
  (v: File | null) => !!v || "Resume is required",
  (v: File) => v.size <= 20 * 1024 * 1024 || "File size must be under 20 MB",
  (v: File) => v.type === "application/pdf" || "Only PDF files are accepted",
];

const handleFileChange = (files: File | File[] | null | undefined) => {
  if (files instanceof File) {
    resumeFile.value = files;
  } else if (Array.isArray(files) && files.length > 0) {
    resumeFile.value = files[0];
  } else {
    resumeFile.value = null;
  }
};

const submitForm = async () => {
  if (!isFormValid.value || !resumeFile.value) {
    (formRef.value as any)?.validate();
    return;
  }

  console.log("Submitting file:", resumeFile.value.name);

  await handleAnalyze({
    companyName: companyName.value,
    jobTitle: jobTitle.value,
    jobDescription: jobDescription.value,
    file: resumeFile.value,
  });
};

const handleAnalyze = async ({
  companyName,
  jobTitle,
  jobDescription,
  file,
}: {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File;
}) => {
  isProcessing.value = true;
  isFailed.value = false;
  statusText.value = "Uploading resume...";

  try {
    const token = session.value?.token;

    if (!token) {
      throw new Error("Not authenticated");
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("companyName", companyName);
    formData.append("jobTitle", jobTitle);
    formData.append("jobDescription", jobDescription);
    formData.append("userId", session.value.user.id);
    formData.append("tenantId", generateUUID());

    statusText.value = "Analyzing with AI...";

    const res: any = await $fetch(`${config.public.apiBase}/resume/analyze`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Analysis response:", res);

    if (!res.success) {
      throw new Error(res.error || "Failed to analyze resume");
    }

    const feedback = res.data;
    statusText.value = "Analysis complete! Redirecting...";

    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push(`/dashboard/${feedback.id}/review`);
  } catch (error: any) {
    console.error("Analysis error:", error);
    statusText.value = error.message || "Failed to analyze resume";
    isFailed.value = true;
    queueMessage.value.push(error.message || "Something went wrong");
  } finally {
    if (!isFailed.value) {
      isProcessing.value = false;
    }
  }
};
</script>

<template>
  <div class="content">
    <h1>AI Analyzer!</h1>
    <span class="text-grey">
      Upload your resume for ATS score and smart feedback
    </span>
  </div>

  <v-container class="bg-white p-4 mt-6 rounded-lg">
    <v-form
      ref="formRef"
      v-model="isFormValid"
      @submit.prevent="submitForm"
      class="d-flex flex-column ga-4"
    >
      <v-text-field
        v-model="companyName"
        :rules="companyNameRules"
        variant="outlined"
        label="Company Name"
      ></v-text-field>

      <v-text-field
        v-model="jobTitle"
        :rules="jobTitleRules"
        variant="outlined"
        label="Job Title"
      ></v-text-field>

      <v-textarea
        v-model="jobDescription"
        :rules="jobDescriptionRules"
        label="Job Description"
        variant="outlined"
        rows="5"
      ></v-textarea>

      <label for="resume-upload" class="w-100 cursor-pointer">
        <div
          class="w-100 border-lg border-dashed border-grey-darken-4 text-center pa-4 font-semibold"
        >
          <p>
            <v-icon
              :icon="resumeFile ? 'mdi-check-circle' : 'mdi-file-pdf-box'"
              :class="resumeFile ? 'text-green' : 'text-green-darken-2'"
              size="24"
            ></v-icon>
            {{ fileDisplayInfo }}
          </p>

          <span v-if="!resumeFile" class="text-caption">PDF (Max 20 MB)</span>
        </div>
      </label>

      <v-file-input
        id="resume-upload"
        v-model="resumeFile"
        :rules="resumeFileRules"
        variant="solo-filled"
        accept=".pdf"
        class="sr-only"
        @update:model-value="handleFileChange"
      >
      </v-file-input>

      <v-btn
        class="mt-2 bg-grey-darken-4 text-white"
        type="submit"
        variant="tonal"
        block
        :disabled="!isFormValid || isProcessing"
      >
        {{ isProcessing ? "Analyzing..." : "Submit" }}
      </v-btn>
    </v-form>
  </v-container>

  <!-- Processing Overlay -->
  <div
    v-if="isProcessing"
    class="position-fixed top-0 left-0 w-100 h-100 bg-white d-flex align-center justify-center"
    style="z-index: 9999"
  >
    <v-container class="d-flex flex-column justify-center align-center pa-12">
      <h1 class="text-grey-darken-4 text-h3 text-center">
        Smart feedback for your dream job!
      </h1>
      <span class="mt-4 text-h5 text-grey text-center">{{ statusText }}</span>

      <v-btn
        v-if="isFailed"
        class="bg-black text-white mt-4"
        @click="isProcessing = false"
      >
        Back
      </v-btn>

      <div v-else class="image-scanning mt-8">
        <img :src="IcimageScanning" alt="Analyzing" width="280" height="280" />
      </div>
    </v-container>
  </div>

  <v-snackbar-queue v-model="queueMessage"></v-snackbar-queue>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.image-scanning {
  border-radius: 20px;
  overflow: hidden;
}
</style>
