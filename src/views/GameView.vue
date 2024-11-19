<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import GameGrid from "@/components/GameGrid.vue";
import GameOverModal from "@/components/GameOverModal.vue";
import WelcomeModal from "@/components/WelcomeModal.vue";
import {
  addPlayedGame,
  getGameRank,
  isUserSignedIn,
  getSignedInUser,
  getUserProfile,
} from "../lib/Repository";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

interface GameMode {
  time: number;
}

interface GameModes {
  [key: string]: GameMode;
}

const modes: GameModes = {
  regular: {
    time: 60,
  },
  blitz: {
    time: 15,
  },
};

const gameMode = ref("regular");
const activeCell = ref({ row: 15, col: 15 });
const gameStarted = ref(false);
const correctClicks = ref(0);
const incorrectClicks = ref(0);
const bps = ref(0);
const ntpm = ref(0);
const timeRemaining = ref(modes[gameMode.value].time);
const timerInterval = ref<ReturnType<
  typeof setInterval
> | null>(null);
const gameOverModalVisible = ref(false);
const gameRank = ref<number | null>(null);
const playerAverage = ref<number | null>(null);
const showDescription = ref(false);
const welcomeModalVisible = ref(true);

// Check if this is the first visit
const hasVisited = localStorage.getItem("hasVisitedWebgrid");
if (hasVisited) {
  welcomeModalVisible.value = false;
}

const startGame = () => {
  gameStarted.value = true;
  startTimer();
};

const startTimer = () => {
  // Reset timer to initial time based on game mode
  timeRemaining.value = modes[gameMode.value].time;

  // Clear any existing interval
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }

  // Start new countdown
  timerInterval.value = setInterval(() => {
    if (timeRemaining.value > 0) {
      calculateScore();
      timeRemaining.value--;
    } else {
      if (timerInterval.value) {
        gameOver();
        clearInterval(timerInterval.value);
      }
    }
  }, 1000);
};

const clearTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
};

const setGameMode = (mode: string) => {
  gameMode.value = mode.toLowerCase();
  timeRemaining.value = modes[gameMode.value].time; // Reset timer when mode changes
  resetGame();
};

const handleCellClick = (row: number, col: number) => {
  console.log("Cell clidked: ", row, col);
  let firstClick = !gameStarted.value;
  if (!gameStarted.value) {
    startGame();
    firstClick = false;
  }

  if (
    row === activeCell.value.row &&
    col === activeCell.value.col
  ) {
    if (!firstClick) correctClicks.value++;
    const newRow = Math.floor(Math.random() * 30) + 1;
    const newCol = Math.floor(Math.random() * 30) + 1;
    activeCell.value = { row: newRow, col: newCol };
    console.log("New active cell: ", activeCell.value);
  } else {
    incorrectClicks.value++;
  }
};

const calculateScore = () => {
  // Calculate NTPM (Net Targets Per Minute)
  ntpm.value =
    (correctClicks.value - incorrectClicks.value) *
    (60 / modes[gameMode.value].time);

  // Calculate BPS (Bits Per Second)
  // The formula should be: BPS = (NTPM * log2(N)) / 60
  // where N is the number of possible targets (30 * 30 = 900).
  // Cannot be negative.
  bps.value = Math.max(0, (ntpm.value * Math.log2(900)) / 60);
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const gameOver = () => {
  gameOverModalVisible.value = true;
};

const resetGame = () => {
  gameStarted.value = false;
  correctClicks.value = 0;
  incorrectClicks.value = 0;
  bps.value = 0;
  ntpm.value = 0;
  activeCell.value = { row: 15, col: 15 };
  gameOverModalVisible.value = false;
  timeRemaining.value = modes[gameMode.value].time;
  clearTimer();
};

const handleWelcomeModalClose = () => {
  welcomeModalVisible.value = false;
  localStorage.setItem("hasVisitedWebgrid", "true");
};

// Clean up interval when component is destroyed
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<template>
  <div class="flex justify-evenly">
    <!-- Game Controls and Time Display -->
    <div
      class="flex items-center justify-center flex-col w-[450px] p-[30px] pb-[160px] pt-[0px]"
    >
      <!-- Title Text -->
      <div class="flex flex-col items-center mb-[20px] gap-2">
        <h1 class="text-[50px] font-bold">
          &nbsp; Play Webgrid+
        </h1>
        <!-- <button
          class="flex items-center text-black border border-black font-light font-[15px] rounded-full px-3 py-1 h-[20px] hover:bg-gray-100"
          @click="showDescription = !showDescription"
        >
          About
        </button> -->
      </div>
      <!-- Game Description -->
      <div v-if="showDescription">
        <p class="text-lg">
          Webgrid is a game created by Neuralink to benchmark
          the speed of their brain-computer interface.
        </p>
        <br />
        <p class="text-lg">
          From the
          <a href="https://www.neuralink.com/webgrid/"
            >original game</a
          >: "At Neuralink, we use a game called Webgrid to test
          how precisely you can control a computer. The goal of
          the game is to click targets on a grid as fast as
          possible while minimizing misclicks. Your score,
          measured in bits per second (BPS), is derived from net
          correct targets selected per minute (NTPM) and grid
          size."
        </p>
      </div>
      <!-- Game Mode Selection -->
      <div class="flex justify-center gap-2">
        <Button
          label="Regular"
          :variant="
            gameMode === 'regular' ? undefined : 'outlined'
          "
          @click="setGameMode('regular')"
          :class="[
            'w-[100px]',
            'h-[40px]',
            gameMode === 'regular'
              ? ['text-white', 'bg-black']
              : ['text-black', 'border-black'],
          ]"
        />
        <Button
          label="Blitz"
          :variant="
            gameMode === 'blitz' ? undefined : 'outlined'
          "
          @click="setGameMode('blitz')"
          :class="[
            'w-[100px]',
            'h-[40px]',
            gameMode === 'blitz'
              ? ['text-white', 'bg-black']
              : ['text-black', 'border-black'],
          ]"
        />
      </div>

      <!-- Game Display -->
      <div class="flex flex-col items-center my-4">
        <div class="text-xl font-bold">
          {{ gameMode === "regular" ? "Regular" : "Blitz" }}
        </div>
        <!-- Timer -->
        <div class="text-[72px] font-bold">
          {{ formatTime(timeRemaining) }}
        </div>
        <!-- BPS Score -->
        <div class="text-[64px] font-light mb-[-10px]">
          {{ bps.toFixed(2) }} BPS
        </div>
        <!-- NTMPS -->
        <div class="text-[36px] font-light text-gray-400">
          {{ Math.round(ntpm) }} NTMP · 30x30
        </div>
      </div>
    </div>
    <!-- Game Grid -->
    <div class="flex flex-col items-center justify-center">
      <GameGrid
        :active-cell="activeCell"
        @cell-clicked="(row, col) => handleCellClick(row, col)"
      />
      <div v-if="!gameStarted" class="text-lg font-bold">
        Click the blue square to begin
      </div>
    </div>
  </div>
  <!-- Game Over Modal -->
  <Dialog
    v-model:visible="gameOverModalVisible"
    modal
    header="Game Over!"
    class="bg-surface-0 text-black border-none"
    @update:visible="(value) => !value && resetGame()"
  >
    <GameOverModal
      :bps="bps"
      :ntpm="ntpm"
      :game-type="gameMode"
      @close="resetGame"
    />
  </Dialog>
  <!-- Welcome Modal -->
  <Dialog
    v-model:visible="welcomeModalVisible"
    modal
    header=" "
    class="bg-surface-0 text-black border-none w-[800px]"
    @update:visible="
      (value) => !value && handleWelcomeModalClose()
    "
  >
    <WelcomeModal @close="handleWelcomeModalClose" />
  </Dialog>
</template>
