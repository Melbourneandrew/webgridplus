<template>
  <div class="flex flex-col mt-[-13px] px-[30px]">
    <div class="text-[36px] font-bold mb-4">
      Welcome to Webgrid+
    </div>

    <div class="text-[18px] space-y-4">
      <p>
        Webgrid is a game created by Neuralink to benchmark the
        speed of their brain-computer interface.
        <a href="https://www.neuralink.com/webgrid/"
          >You can try it out here.</a
        >
      </p>
      <p>
        I think its fun to play without the brain interface, so
        I made this version with a 'Blitz' mode and a
        leaderboard so I can compete against my coworkers.
      </p>
      <div class="space-y-1 pt-[15px] px-[20px] rounded-lg">
        <div class="text-xl font-semibold">The Goal:</div>
        <p>
          Click as many blue cells as possible within the
          allotted time. Misclicks will be penalized.
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end mt-[30px]">
      <Button
        label="I want to play!"
        @click="$emit('close')"
        variant="filled"
        class="text-white bg-black"
      />
    </div>
  </div>
</template>

<script setup>
defineEmits(["close"]);
</script>
