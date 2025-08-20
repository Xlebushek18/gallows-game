<script setup lang="ts">
const letters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('')

const emit = defineEmits<{
  (e: 'select', letter: string): void
}>()
</script>

<template>
  <div class="keyboard">
    <button 
      v-for="l in letters" 
      :key="l" 
      class="key"
      @click="emit('select', l)"
    >
      {{ l }}
    </button>
  </div>
</template>

<style scoped>
.keyboard {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
  margin-top: 20px;
  justify-items: center;
}

.key {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #f8f8f8;
  font-size: 18px;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s;
}

.key:hover {
  background: #e2e2e2;
}
</style>
