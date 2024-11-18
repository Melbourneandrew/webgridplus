<script setup>
import { ref } from "vue";
import ProfilePicture from "@/components/ProfilePicture.vue";
import { updateUserProfilePicture } from "@/lib/Repository";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
const emit = defineEmits(["close"]);

const profilePicture = ref("");
const selectedFile = ref(null);
const previewUrl = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const handleUpload = async () => {
  isLoading.value = true;
  if (selectedFile.value) {
    try {
      await updateUserProfilePicture(selectedFile.value);
      // You might want to emit a success event or close the modal here
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      errorMessage.value = "Error uploading profile picture";
    }
  }
  isLoading.value = false;
  emit("close");
};
</script>

<template>
  <div class="flex flex-col mt-[-13px] px-[30px]">
    <div class="text-[36px] font-bold mb-4">
      Add a Profile Picture
    </div>

    <div class="text-[18px] space-y-4">
      <p>
        Upload a profile picture to be displayed alongside your
        profile.
      </p>
    </div>
    <ProfilePicture :src="previewUrl" />

    <input
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      class="my-4"
    />
    <div>
      <LoadingIndicator v-if="isLoading" />
      <Button
        v-else
        label="Upload Picture"
        variant="outlined"
        class="w-[200px] m-auto"
        @click="handleUpload"
        :disabled="!selectedFile"
      />
    </div>
    <div v-if="errorMessage" class="text-red-500">
      {{ errorMessage }}
    </div>
  </div>
</template>
