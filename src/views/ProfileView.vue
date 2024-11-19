<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getSignedInUser,
  getUserProfile,
  signOutUser,
} from "@/lib/Repository";
import { useRoute, useRouter } from "vue-router";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import ProfilePicture from "@/components/ProfilePicture.vue";
import ProfilePictureModal from "@/components/ProfilePictureModal.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
const router = useRouter();
const profile = ref<any>(null); // Initialize as null to handle loading state
const isLoading = ref(true);
const isSignedInUser = ref(false);
const route = useRoute();
let userId = route.params.userId as string;

const profilePictureModalVisible = ref(false);
const openProfilePictureModal = () => {
  profilePictureModalVisible.value = true;
};
const handleProfilePictureModalClose = () => {
  profilePictureModalVisible.value = false;
};

const copySharableLink = () => {
  let link = window.location.href;
  console.log(link.split("/"));
  if (link.split("/")[link.split("/").length - 1].length <= 7) {
    if (link.length > 0 && link[link.length - 1] !== "/") {
      link += "/";
    }
    link += `${userId}`;
  }
  navigator.clipboard.writeText(link);
};

const handleSignOut = async () => {
  await signOutUser();
  await router.push("/login");
  window.location.reload();
};

onMounted(async () => {
  try {
    // if there is no userId display the signed in user's profile
    if (!userId) {
      console.log(
        "No profile in route params. Displaying signed in user's profile"
      );
      const { data, error } = await getSignedInUser();
      console.log("Signed in user data:", data);
      if (error) throw error;
      userId = data?.user?.id;
      isSignedInUser.value = true;
    }

    const { data } = await getUserProfile(userId);
    profile.value = {
      ...data.regular, // This is for the display name and profile picture
      ...data.blitz, // This is for the display name and profile picture if the regular profile is not present
      regular: data.regular,
      blitz: data.blitz,
    };
    console.log("User profile data:", profile.value);
    isLoading.value = false;
  } catch (error) {
    console.error("Failed to load profile:", error);
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="flex justify-center">
    <div v-if="isLoading">
      <LoadingIndicator />
    </div>
    <div
      class="flex flex-col"
      v-else-if="profile?.display_name"
    >
      <h1 class="text-[48px] text-center mb-[20px] font-bold">
        User Profile
      </h1>
      <div class="bg-surface-0 rounded-lg shadow-xl p-[20px]">
        <!-- User Profile Header -->
        <div class="flex items-center gap-4 mb-[10px]">
          <div class="flex flex-col items-center">
            <ProfilePicture :src="profile.profile_picture" />
            <div
              @click="openProfilePictureModal"
              class="underline hover:cursor-pointer"
              v-if="isSignedInUser"
            >
              Edit
            </div>
          </div>
          <div class="flex flex-col">
            <!-- User Display Name -->
            <h2 class="text-2xl font-bold">
              {{
                profile.display_name.length > 27
                  ? profile.display_name.slice(0, 27) + "..."
                  : profile.display_name
              }}
            </h2>
            <!-- User Id -->
            <div class="font-light text-gray-400">
              {{ profile.profile_id }}
            </div>
          </div>
          <div class="ml-auto">
            <Button
              icon="pi pi-copy"
              iconClass="text-[22px]"
              variant="text"
              class="mb-[30px]"
              @click="copySharableLink"
            />
          </div>
        </div>
        <!-- Regular Stats -->
        <div class="text-[24px] font-bold">Regular</div>
        <div class="flex justify-center gap-2">
          <div
            class="border border-black rounded px-[15px] min-w-[100px] h-[100px] flex flex-col items-center justify-center"
          >
            <div class="font-bold">Rank</div>
            <div class="flex text-[48px] font-bold mr-[12px]">
              <div
                class="mb-auto mt-[10px] mr-[5px] text-[14px] text-gray-400"
              >
                #
              </div>
              {{ profile?.regular?.rank || "0" }}
            </div>
          </div>
          <!-- High Score BPS -->
          <div
            class="border border-black rounded px-[15px] h-[100px] flex flex-col items-center justify-center"
          >
            <div class="font-bold">High Score</div>
            <div class="flex text-[48px] font-bold">
              {{
                profile?.regular?.highest_score
                  ? profile.regular.highest_score.toFixed(2)
                  : "0.00"
              }}
              <div
                class="mt-auto mb-[14px] text-[14px] text-gray-400"
              >
                bps
              </div>
            </div>
          </div>
          <!-- Average BPS -->
          <div
            class="border border-black rounded px-[15px] h-[100px] flex flex-col items-center justify-center"
          >
            <div class="font-bold">Average</div>
            <div class="flex text-[48px] font-bold">
              {{
                profile?.regular?.average_score
                  ? profile.regular.average_score.toFixed(2)
                  : "0.00"
              }}
              <div
                class="mt-auto mb-[14px] text-[14px] text-gray-400"
              >
                bps
              </div>
            </div>
          </div>
          <!-- Games Played -->
          <div
            class="border border-black rounded px-[15px] h-[100px] flex flex-col items-center justify-center"
          >
            <div class="font-bold">Games Played</div>
            <div class="flex text-[48px] font-bold">
              {{
                profile?.regular?.total_games_played
                  ? profile.regular.total_games_played.toFixed(
                      0
                    )
                  : "0"
              }}
            </div>
          </div>
        </div>
        <br />
        <!-- Blitz Stats -->
        <div class="text-[24px] font-bold">Blitz</div>
        <div class="flex justify-center gap-2">
          <div
            class="border border-black rounded px-[15px] min-w-[100px] h-[100px] flex flex-col items-center justify-center"
          >
            <div class="font-bold">Rank</div>
            <div class="flex text-[48px] font-bold mr-[12px]">
              <div
                class="mb-auto mt-[10px] mr-[5px] text-[14px] text-gray-400"
              >
                #
              </div>
              {{ profile?.blitz?.rank || "0" }}
            </div>
          </div>
          <!-- High Score BPS -->
          <div
            class="border border-black rounded px-[15px] h-[100px] flex flex-col items-center justify-center"
          >
            <div class="font-bold">High Score</div>
            <div class="flex text-[48px] font-bold">
              {{
                profile?.blitz?.highest_score
                  ? profile.blitz.highest_score.toFixed(2)
                  : "0.00"
              }}
              <div
                class="mt-auto mb-[14px] text-[14px] text-gray-400"
              >
                bps
              </div>
            </div>
          </div>
          <!-- Average BPS -->
          <div
            class="border border-black rounded px-[15px] h-[100px] flex flex-col items-center justify-center"
          >
            <div class="font-bold">Average</div>
            <div class="flex text-[48px] font-bold">
              {{
                profile?.blitz?.average_score
                  ? profile.blitz.average_score.toFixed(2)
                  : "0.00"
              }}
              <div
                class="mt-auto mb-[14px] text-[14px] text-gray-400"
              >
                bps
              </div>
            </div>
          </div>
          <!-- Games Played -->
          <div
            class="border border-black rounded px-[15px] h-[100px] flex flex-col items-center justify-center"
          >
            <div class="font-bold">Games Played</div>
            <div class="flex text-[48px] font-bold">
              {{
                profile?.blitz?.total_games_played
                  ? profile.blitz.total_games_played.toFixed(0)
                  : "0"
              }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex justify-end mt-[20px] underline hover:cursor-pointer m-auto"
        @click="handleSignOut"
      >
        Sign Out
      </div>
    </div>
    <div v-else>
      <div>Failed to load profile</div>
    </div>
  </div>
  <!-- Profile Picture Modal -->
  <Dialog
    v-model:visible="profilePictureModalVisible"
    modal
    header=" "
    class="bg-surface-0 text-black border-none w-[800px]"
    @update:visible="
      (value) => !value && handleProfilePictureModalClose()
    "
  >
    <ProfilePictureModal
      @close="handleProfilePictureModalClose"
    />
  </Dialog>
</template>
