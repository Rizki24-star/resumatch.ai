<script setup lang="ts">
import { ref, computed } from 'vue';
import { bg } from 'vuetify/locale';
import IcimageScanning from '~/assets/images/ic-document-scanning2.gif';
import { AIResponseFormat } from '~/constants';

definePageMeta({
    layout: 'dashboard'
})

const puterStore = usePuterStore()
const router = useRouter()

const formRef = ref<HTMLFormElement | null>(null);
const isFormValid = ref(false);

const companyName = ref('')
const jobTitle = ref('')
const jobDescription = ref('')

const statusText = ref('')
const isFailed = ref(false)
const isProcessing = ref(false)

const resumeFile = ref<File | null | undefined>(null);

const fileDisplayInfo = computed(() => {
    if (resumeFile.value) {
        const name = resumeFile.value.name;
        // Format size to mb
        const sizeMB = (resumeFile.value.size / (1024 * 1024)).toFixed(2);
        return `${name} (${sizeMB} MB)`;
    }
    return 'Resume upload';
});

// Validation Rules
const companyNameRules = [
    (v: string) => !!v || 'Company name is required',
    (v: string) => v.length >= 2 || 'Min 2 characters'
]

const jobTitleRules = [
    (v: string) => !!v || 'Job title is required',
    (v: string) => v.length >= 2 || 'Min 2 characters'
]

const jobDescriptionRules = [
    (v: string) => !!v || 'Job description is required',
    (v: string) => v.length >= 10 || 'Min 10 characters'
]

const resumeFileRules = [
    (v: File | null) => !!v || 'Resume is required',
    (v: File) => (v.size <= 20 * 1024 * 1024) || 'File size must be under 20 MB',
    (v: File) => (v.type === 'application/pdf') || 'Only PDF files are accepted'
];

// Updates resumeFile and handles array/null input from v-file-input
const handleFileChange = (files: File | File[] | null | undefined) => {
    if (files instanceof File) { // Single
        resumeFile.value = files;
    } else if (Array.isArray(files) && files.length > 0) { // Multiple
        resumeFile.value = files[0];
    } else {
        resumeFile.value = null;
    }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const submitForm = async () => {
    isProcessing.value = true
    if (!isFormValid.value || !resumeFile.value) {
        (formRef.value as any)?.validate();
        return;
    }
    console.log('Submitting file:', resumeFile.value.name);
    handleAnalyze({ companyName: companyName.value, jobTitle: jobTitle.value, jobDescription: jobDescription.value, file: resumeFile.value });
};


const handleAnalyze = async (
    {
        companyName,
        jobTitle,
        jobDescription,
        file,
    }: {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }
) => {
    isProcessing.value = true;
    statusText.value = "Uploading the file...";

    const uploadedFile = await puterStore.upload([file]);
    if (!uploadedFile) {
        statusText.value = "Error: Failed to upload file";
        isFailed.value = true
        return;
    }

    statusText.value = "Converting to image..."
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) {
        statusText.value = "Error: Failed to convert PDF to image";
        isFailed.value = true
        return;
    }

    statusText.value = "Uploading to image..."
    const uploadedImage = await puterStore.upload([imageFile.file])
    if (!uploadedImage) {
        statusText.value = "Error: Failed to upload image";
        isFailed.value = true
        return;
    }

    statusText.value = "Preparing data...";
    const uuid = generateUUID();
    const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
    };

    await puterStore.setKV(`resume:${uuid}`, JSON.stringify(data));

    statusText.value = "Analyzing...";
    const feedback = await puterStore.feedback(
        uploadedFile.path,
        `You are an expert in ATS (Applicant Tracking System) and resume analysis.
    Please analyze and rate this resume and suggest how to improve it.
    The rating can be low if the resume is bad.
    Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
    If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
    If available, use the job description for the job user is applying to to give more detailed feedback.
    If provided, take the job description into consideration.
    The job title is: ${jobTitle}
    The job description is: ${jobDescription}
    Provide the feedback using the following format:
    ${AIResponseFormat}
    Return the analysis as an JSON object, without any other text and without the backticks.
    Do not include any other text or comments.`
    );

    if (!feedback) {
        console.error("Feedback error:", feedback)
        statusText.value = "Error: Failed to analyze resume";
        isFailed.value = true
        return;
    }

    console.log('AI feedback:', feedback); // Check response

    const feedbackText =
        typeof feedback.message.content === "string"
            ? feedback.message.content
            : feedback.message.content[0].text;
    data.feedback = JSON.parse(feedbackText);

    await puterStore.setKV(`resume:${uuid}`, JSON.stringify(data));
    statusText.value = "Analysis complete, redirecting...";

    router.push(`/dashboard/${uuid}/review`);

}

const clearFile = () => {
    resumeFile.value = null;
};

</script>


<template>
    <div class="content">
        <h1>AI Analyzer!</h1>
        <span class="text-grey">Upload your resume for ATS score and smart
            feedback</span>
    </div>
    <v-container class="bg-white p-4 mt-6 rounded-lg">
        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="submitForm" class="d-flex flex-column ga-4">

            <v-text-field v-model="companyName" :rules="companyNameRules" variant="outlined"
                label="Company Name"></v-text-field>

            <v-text-field v-model="jobTitle" :rules="jobTitleRules" variant="outlined" label="Job Title"></v-text-field>

            <v-textarea v-model="jobDescription" :rules="jobDescriptionRules" label="Job Description"
                variant="outlined"></v-textarea>

            <label for="resume-upload" class="w-100 cursor-pointer">
                <div class="w-100 border-lg border-dashed border-grey-darken-4 text-center pa-4 font-semibold">

                    <p>
                        <v-icon :icon="resumeFile ? 'mdi-check-circle' : 'mdi-file-pdf-box'"
                            :class="resumeFile ? 'text-green' : 'text-green-darken-2'" size="24"></v-icon>
                        {{ fileDisplayInfo }}
                    </p>

                    <span v-if="!resumeFile" class="text-caption">PDF (Max 20 MB)</span>
                </div>
            </label>

            <v-file-input id="resume-upload" v-model="resumeFile" :rules="resumeFileRules" variant="solo-filled"
                accept=".pdf" class="sr-only" @update:model-value="handleFileChange">
            </v-file-input>

            <v-btn class="mt-2 bg-grey-darken-4 text-white" type="submit" variant="tonal" block
                :disabled="!isFormValid">
                Submit
            </v-btn>
        </v-form>
    </v-container>

    <div v-if="isProcessing" class="position-absolute top-0 right-0 w-100 h-100 bg-white">
        <v-container class="d-flex flex-column justify-center align-center pa-12 h-100 m-auto">
            <h1 class="text-grey-darken-4 text-h3"> Smart feedback for your dream job! </h1>
            <span class="mt-4 text-h5  text-grey"> {{ statusText }}</span>
            <v-btn class="bg-black text-white mt-4" v-if="isFailed" @click="isProcessing = false">Back</v-btn>
            <div class="image-scanning">
                <img :src="IcimageScanning" alt="Upload Icon" width="280" height="280" />
            </div>
        </v-container>
    </div>
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
    border-color: black;
    overflow: hidden;
    margin-top: 100px;
}
</style>
