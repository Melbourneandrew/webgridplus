<template>
  <div class="p-5">
    <h1 class="text-2xl font-bold mb-6">
      Development Testing View
    </h1>

    <!-- Sign Up Section -->
    <section class="mb-8 p-5 border border-gray-300 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Sign Up Test</h2>
      <form
        @submit.prevent="handleSignUp"
        class="flex flex-col gap-3 max-w-sm"
      >
        <input
          v-model="signUp.displayName"
          placeholder="Display Name"
          class="p-2 border border-gray-300 rounded-md"
        />
        <input
          v-model="signUp.email"
          placeholder="Email"
          class="p-2 border border-gray-300 rounded-md"
        />
        <input
          v-model="signUp.password"
          type="password"
          placeholder="Password"
          class="p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          class="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Test Sign Up
        </button>
      </form>
    </section>

    <!-- Sign In Section -->
    <section class="mb-8 p-5 border border-gray-300 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Sign In Test</h2>
      <form
        @submit.prevent="handleSignIn"
        class="flex flex-col gap-3 max-w-sm"
      >
        <input
          v-model="signIn.email"
          placeholder="Email"
          class="p-2 border border-gray-300 rounded-md"
        />
        <input
          v-model="signIn.password"
          type="password"
          placeholder="Password"
          class="p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          class="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Test Sign In
        </button>
      </form>
    </section>

    <!-- Get Signed In User -->
    <section class="mb-8 p-5 border border-gray-300 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">
        Get Signed In User Test
      </h2>
      <button
        @click="handleGetSignedInUser"
        class="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        Test Get Signed In User
      </button>
    </section>

    <!-- Get Leaderboard Section -->
    <section class="mb-8 p-5 border border-gray-300 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">
        Leaderboard Test
      </h2>
      <div class="flex flex-wrap gap-3">
        <button
          @click="handleGetLeaderboard('regular')"
          class="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Get Regular Leaderboard
        </button>
        <button
          @click="handleGetLeaderboard('blitz')"
          class="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Get Blitz Leaderboard
        </button>
      </div>
    </section>

    <!-- Add Played Game Section -->
    <section class="mb-8 p-5 border border-gray-300 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">
        Add Played Game Test
      </h2>
      <form
        @submit.prevent="handleAddPlayedGame"
        class="flex flex-col gap-3 max-w-sm"
      >
        <input
          v-model.number="playedGame.bps"
          type="number"
          placeholder="BPS (Bits Per Second)"
          class="p-2 border border-gray-300 rounded-md"
        />
        <select
          v-model="playedGame.gameType"
          class="p-2 border border-gray-300 rounded-md"
        >
          <option value="regular">Regular</option>
          <option value="blitz">Blitz</option>
        </select>
        <button
          type="submit"
          class="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Add Played Game
        </button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  signUpNewUser,
  signInUser,
  getSignedInUser,
  getLeaderboard,
  addPlayedGame,
} from "@/lib/Repository";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Button from "primevue/button";

const signUp = ref({
  displayName: "",
  email: "",
  password: "",
});

const signIn = ref({
  email: "",
  password: "",
});

const playedGame = ref({
  bps: 0,
  gameType: "regular",
});

async function handleSignUp() {
  const result = await signUpNewUser(
    signUp.value.displayName,
    signUp.value.email,
    signUp.value.password
  );
  console.log("Sign Up Result:", result);
}

async function handleSignIn() {
  const result = await signInUser(
    signIn.value.email,
    signIn.value.password
  );
  console.log("Sign In Result:", result);
}

async function handleGetSignedInUser() {
  const result = await getSignedInUser();
  console.log("Get Signed In User Result:", result);
}

async function handleGetLeaderboard(
  gameType?: "regular" | "blitz"
) {
  const result = await getLeaderboard(gameType);
  console.log("Get Leaderboard Result:", result);
}

async function handleAddPlayedGame() {
  const result = await addPlayedGame({
    bps: playedGame.value.bps,
    gameType: playedGame.value.gameType,
  });
  console.log("Add Played Game Result:", result);
}
</script>
