<template>
  <div
    class="grid grid-cols-30 gap-0 w-full max-w-[1100px] min-w-[660px] aspect-square"
  >
    <div v-for="row in 30">
      <div
        v-for="col in 30"
        :key="`${row}-${col}`"
        :class="[
          'aspect-square w-full border border-black',
          !clickedCell && !isActive(row, col)
            ? 'hover:bg-gray-300'
            : '',
          'cursor-pointer',
          isActive(row, col) ? 'bg-[#1d82f9]' : '',
          clickedCell?.row === row && clickedCell?.col === col
            ? 'bg-red-500'
            : '',
        ]"
        @click="handleCellClick(row, col)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  activeCell?: { row: number; col: number };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (event: "cellClicked", row: number, col: number): void;
}>();

const clickedCell = ref<{ row: number; col: number } | null>(
  null
);

const isActive = (row: number, col: number): boolean => {
  return (
    props.activeCell?.row === row &&
    props.activeCell?.col === col
  );
};

const handleCellClick = async (row: number, col: number) => {
  emit("cellClicked", row, col);
  if (!isActive(row, col)) {
    clickedCell.value = { row, col };
    // Reset the red highlight after 200ms
    await new Promise((resolve) => setTimeout(resolve, 200));
    clickedCell.value = null;
  }
};
</script>

<style scoped>
.grid-cols-30 {
  grid-template-columns: repeat(30, minmax(0, 1fr));
}
</style>
