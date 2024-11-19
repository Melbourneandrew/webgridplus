<script setup>
import { ref, onMounted } from "vue";
import Button from "primevue/button";
import LoadingIndicator from "./LoadingIndicator.vue";
import {
  addPlayedGame,
  getGameRank,
  isUserSignedIn,
  getSignedInUser,
  getUserProfile,
} from "../lib/Repository";

const props = defineProps({
  bps: {
    type: Number,
    required: true,
  },
  ntpm: {
    type: Number,
    required: true,
  },
  gameType: {
    type: String,
    required: true,
  },
});

const isLoading = ref(true);
const average = ref(null);
const rank = ref(null);

onMounted(async () => {
  try {
    // Save the game
    const playedGame = await addPlayedGame({
      bps: props.bps,
      gameType: props.gameType,
    });

    if (!playedGame) {
      console.error("Failed to save game");
      isLoading.value = false;
      return;
    }

    // Get user profile stats if logged in
    const isLoggedIn = await isUserSignedIn();
    if (isLoggedIn) {
      const {
        data: { user },
      } = await getSignedInUser();
      if (user) {
        const profileStats = await getUserProfile(user.id);
        average.value =
          props.gameType === "regular"
            ? profileStats.data.regular?.average_score
            : profileStats.data.blitz?.average_score;
      }
    }

    // Get game ranking
    const currentGameRanking = await getGameRank(
      playedGame.data.id,
      playedGame.data.game_type_id
    );

    if (currentGameRanking) {
      rank.value = currentGameRanking.data[0].rank;
    }
  } catch (error) {
    console.error("Error saving game:", error);
  } finally {
    isLoading.value = false;
  }
});

defineEmits(["close"]);

const shareOnTwitter = () => {
  console.log("Sharing on twitter...");
  const baseUrl = window.location.origin;
  const shareLink = `https://x.com/intent/tweet?text=I've just achieved a score of ${props.bps.toFixed(
    2
  )} BPS on Webgrid\+! Can you beat me?&url=${baseUrl}`;
  window.open(shareLink, "_blank");
};
</script>

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

    <!-- Loading state -->
    <div v-if="isLoading" class="flex my-4">
      <LoadingIndicator :width="40" :height="40" />
    </div>

    <!-- Results state -->
    <template v-else>
      <div
        v-if="rank != null"
        class="text-[18px] text-gray-400"
      >
        Game ranks #{{ rank }} ever played
      </div>
      <div
        v-if="average !== null"
        class="text-[24px] mt-[10px]"
      >
        Your all-time average is {{ average.toFixed(2) }} BPS
      </div>
      <div v-else class="text-[24px] mt-[10px]">
        <a href="/login">Sign up</a> to see your future games on
        the leaderboard!
      </div>
    </template>

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
