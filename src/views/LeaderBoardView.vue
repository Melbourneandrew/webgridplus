<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { getLeaderboard } from "@/lib/Repository";
import ProfilePicture from "@/components/ProfilePicture.vue";
import { useRouter } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
const router = useRouter();

const leaderboard = ref([]);
const gameType = ref("regular");
const isLoading = ref(false);

async function fetchLeaderboard() {
  isLoading.value = true;
  console.log(
    "Fetching leaderboard for game type:",
    gameType.value
  );
  const { data, error } = await getLeaderboard(gameType.value);
  if (error) {
    console.error("Error fetching leaderboard:", error);
    return;
  }
  console.log("Leaderboard data:", data);
  leaderboard.value = data || [];
  isLoading.value = false;
}

async function handleRowClick(event: any) {
  console.log(event);
  router.push(`/profile/${event.data.user_id}`);
}

watchEffect(() => {
  fetchLeaderboard();
});
</script>

<template>
  <div class="flex flex-col gap-4 px-[30px]">
    <div
      class="card min-w-[70rem] max-w-[100rem] m-auto bg-surface-0"
    >
      <!-- Title -->
      <div class="text-[48px] font-semibold mb-[10px]">
        {{ gameType === "regular" ? "Regular" : "Blitz" }}
        Leaderboard
      </div>
      <!-- Game Type Selector -->
      <div class="flex gap-3">
        <Button
          label="Regular"
          :variant="
            gameType === 'regular' ? undefined : 'outlined'
          "
          @click="gameType = 'regular'"
          :class="[
            'w-[100px]',
            'h-[40px]',
            gameType === 'regular'
              ? ['text-white', 'bg-black']
              : ['text-black', 'border-black'],
          ]"
        />
        <Button
          label="Blitz"
          :variant="
            gameType === 'blitz' ? undefined : 'outlined'
          "
          @click="gameType = 'blitz'"
          :class="[
            'w-[100px]',
            'h-[40px]',
            gameType === 'blitz'
              ? ['text-white', 'bg-black']
              : ['text-black', 'border-black'],
          ]"
        />
      </div>
      <!-- Leaderboard -->
      <DataTable
        :value="leaderboard"
        selectionMode="single"
        @row-click="handleRowClick"
        class="bg-surface-0"
      >
        <Column
          field="rank"
          header="Rank"
          class="text-bold font-[48px] w-[50px]"
        >
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>
        <Column field="profile_picture" class="w-[100px]">
          <template #body="slotProps">
            <ProfilePicture
              :src="slotProps.data.profile_picture"
            />
          </template>
        </Column>
        <Column field="display_name" header="Name">
          <template #body="slotProps">
            {{
              slotProps.data.display_name.length > 27
                ? slotProps.data.display_name.slice(0, 27) +
                  "..."
                : slotProps.data.display_name
            }}
          </template>
        </Column>
        <Column
          field="bps"
          header="BPS"
          class="text-bold font-[48px]"
        >
          <template #body="slotProps">
            {{ slotProps.data.bps.toFixed(2) }}
          </template>
        </Column>
        <Column field="played_at" header="Date">
          <template #body="slotProps">
            {{
              new Date(
                slotProps.data.played_at
              ).toLocaleDateString()
            }}
          </template>
        </Column>
      </DataTable>
      <div class="flex justify-center">
        <LoadingIndicator v-if="isLoading" />
      </div>
    </div>
  </div>
</template>
