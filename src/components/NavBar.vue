<script setup lang="ts">
import { useRouter } from "vue-router";
import { isUserSignedIn } from "../lib/Repository";
import { onMounted, ref } from "vue";
const router = useRouter();
const userLoggedIn = ref(false);

onMounted(async () => {
  userLoggedIn.value = await isUserSignedIn();
});
</script>

<template>
  <div
    class="flex w-screen items-center justify-end gap-1 p-[20px] pt-[15px]"
  >
    <!-- Title -->
    <div class="text-[36px] font-bold mr-auto">Webgrid+</div>
    <!-- Play Button -->
    <div>
      <Button
        label="Play"
        variant="outlined"
        icon="pi pi-th-large"
        iconPos="right"
        @click="router.push('/game')"
        v-if="
          !$route.path.includes('login') &&
          !$route.path.includes('signup')
        "
      />
    </div>
    <div>
      <Button
        label="Leaderboard"
        variant="outlined"
        icon="pi pi-star"
        iconPos="right"
        @click="router.push('/leaderboard')"
        v-if="
          !$route.path.includes('login') &&
          !$route.path.includes('signup')
        "
      />
    </div>
    <!-- Login / Signup Buttons -->

    <Button
      label="Login"
      variant="outlined"
      @click="router.push('/login')"
      v-if="
        !$route.path.includes('login') &&
        !$route.path.includes('signup') &&
        !userLoggedIn
      "
    />
    <Button
      label="Signup"
      variant="outlined"
      @click="router.push('/signup')"
      v-if="
        !$route.path.includes('login') &&
        !$route.path.includes('signup') &&
        !userLoggedIn
      "
    />
    <!-- Profile Button -->
    <div v-if="userLoggedIn">
      <Button
        label="Profile"
        variant="outlined"
        icon="pi pi-user"
        iconPos="right"
        @click="router.push('/profile')"
      />
    </div>
  </div>
</template>
