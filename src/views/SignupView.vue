<script setup lang="ts">
import { ref } from "vue";
import { signUpNewUser } from "@/lib/Repository";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const displayName = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

const submit = async (e: Event) => {
  e.preventDefault();
  isLoading.value = true;
  try {
    const { error } = await signUpNewUser(
      displayName.value,
      email.value,
      password.value
    );

    if (error) {
      throw error;
    }

    await router.push("/game");
    window.location.reload();
  } catch (error) {
    errorMessage.value = "Error creating account";
    console.error("Signup error:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center mt-[100px]">
    <div
      class="flex flex-col justify-center items-center p-[30px]"
    >
      <!-- Title -->
      <div class="flex flex-col items-center mb-[20px]">
        <h1 class="text-[50px] font-bold">
          Sign Up for Webgrid+
        </h1>
      </div>

      <!-- Signup Form -->
      <form
        @submit="submit"
        class="flex flex-col gap-4 w-[400px]"
      >
        <div class="flex flex-col gap-2">
          <FloatLabel variant="on" class="text-white">
            <InputText
              v-model="displayName"
              name="displayName"
              type="text"
              placeholder="Display Name"
              autocomplete="displayName"
              class="w-full bg-surface-0 text-black placeholder:text-gray-500"
            />
            <label for="displayName">Display Name</label>
          </FloatLabel>
          <FloatLabel variant="on" class="text-white">
            <InputText
              v-model="email"
              name="email"
              type="text"
              placeholder="Email"
              autocomplete="email"
              class="w-full bg-surface-0 text-black placeholder:text-gray-500"
            />
            <label for="email">Email</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <InputText
              v-model="password"
              name="password"
              type="password"
              placeholder="Password"
              autocomplete="current-password"
              class="w-full bg-surface-0 text-black placeholder:text-gray-500"
            />
            <label for="password">Password</label>
          </FloatLabel>
        </div>

        <Button
          type="submit"
          label="Sign up"
          class="h-[40px] text-white bg-black"
          :loading="isLoading"
        />
        <a class="text-center" href="/login">Login</a>
        <div v-if="errorMessage" class="text-red-500">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>
