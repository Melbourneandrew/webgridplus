<template>
  <div class="flex flex-col px-[30px]">
    <div class="text-[36px]">Your Score:</div>
    <div class="flex items-center mt-[-10px]">
      <div class="text-[72px] font-bold">
        {{ bps.toFixed(2) }} BPS
      </div>
      <div class="text-[72px] font-extralight text-gray-400">
        &nbsp;{{ Math.round(ntpm) }} NTPM
      </div>
    </div>
    <div class="text-[18px] text-gray-400">
      Game ranks #{{ rank }} ever played
    </div>
    <div v-if="average !== null" class="text-[24px] mt-[10px]">
      Your all-time average is {{ average.toFixed(2) }} BPS
    </div>
    <!-- Actions -->
    <div class="flex justify-end mt-[30px] gap-4">
      <Button
        label="Play Again"
        @click="$emit('close')"
        variant="outlined"
        class="text-black border-black"
      />
      <Button
        label="Share"
        variant="filled"
        class="text-white bg-black"
        icon="pi pi-twitter"
        icon-pos="right"
        @click="shareOnTwitter"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  bps: {
    type: Number,
    required: true,
  },
  ntpm: {
    type: Number,
    required: true,
  },
  average: {
    type: Number,
  },
  rank: {
    type: Number,
    required: true,
  },
});

defineEmits(["close"]);

const shareOnTwitter = () => {
  console.log("Sharing on twitter...");
  const baseUrl = window.location.origin;
  const shareLink = `https://x.com/intent/tweet?text=I've just achieved a score of ${props.bps.toFixed(
    2
  )} BPS on Webgrid+! Can you beat me?&url=${baseUrl}`;
  window.open(shareLink, "_blank");
};
</script>
