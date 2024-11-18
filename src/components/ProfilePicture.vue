<script setup lang="ts">
defineProps<{
  src: string;
}>();
</script>

<template>
  <div class="p-[0px] w-fit">
    <div class="image-cropper">
      <img
        :src="
          src ||
          'https://imagedelivery.net/tQa_QONPmkASFny9ZSDT4A/658a25ba-5b3a-4974-3920-f4adb05e2d00/public'
        "
        class="horizontal center"
      />
    </div>
  </div>
</template>

<style scoped>
.image-cropper {
  width: 55px;
  height: 80px;
  position: relative;
  overflow: hidden;
  border-radius: 50%/30%;
}

/* Common img styles in web dev environments */
img {
  height: auto;
  max-width: 100%;
}

/* Center image inside of parent */
img.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* For horizontal rectangles */
img.horizontal {
  height: 100%;
  width: auto;
  max-width: 9999px; /* max-content fall back */
  max-width: max-content;
}
</style>
