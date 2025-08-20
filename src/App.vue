<script setup lang="ts">
import GameFigure from './components/GameFigure.vue'
import GameHeader from './components/GameHeader.vue'
import GamePopup from './components/GamePopup.vue'
import GameWord from './components/GameWord.vue'
import GameWrongLetters from './components/GameWrongLetters.vue'
import GameNotification from './components/GameNotification.vue'
import { ref, watch } from 'vue'
import { useRandomWord } from './composables/useRandomWord'
import { useLetters } from './composables/useLetters'

const { word, getRandomWord } = useRandomWord()
const { letters, correctLetters, wrongLetters, isLose, isWin } = useLetters(word)

const notification = ref<InstanceType<typeof GameNotification> | null>(null)
const popup = ref<InstanceType<typeof GamePopup> | null>(null)

// Следим за победой/поражением
watch(wrongLetters, () => {
  if (isLose.value) popup.value?.open('lose')
})

watch(correctLetters, () => {
  if (isWin.value) popup.value?.open('win')
})

// Ссылка на скрытое поле
const hiddenInput = ref<HTMLInputElement | null>(null)

// Обработчик ввода буквы
const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const key = input.value.trim().toLowerCase()
  if (!key) return

  if (letters.value.includes(key)) {
    notification.value?.open()
    setTimeout(() => notification.value?.close(), 2000)
  } else if (/[а-яё]/i.test(key)) {
    letters.value.push(key)
  }

  input.value = '' // очищаем поле после ввода
}

// Перезапуск игры
const restart = async () => {
  await getRandomWord()
  letters.value = []
  popup.value?.close()
}

// Фокус на поле при клике на экран
const focusInput = () => {
  hiddenInput.value?.focus()
}
</script>

<template>
  <div id="app" @click="focusInput" style="min-height:100vh;">
    <GameHeader />

    <div class="game-container">
      <GameFigure :wrong-letters-count="wrongLetters.length" />
      <GameWrongLetters :wrong-letters="wrongLetters" />
      <GameWord :word="word" :correct-letters="correctLetters" />
    </div>

    <!-- Скрытое поле для ввода с нативной клавиатурой -->
    <input
      ref="hiddenInput"
      type="text"
      maxlength="1"
      @input="handleInput"
      style="opacity:0; position:absolute; top:-100px; left:0; width:1px; height:1px;"
    />

    <!-- Итоговое сообщение -->
    <GamePopup ref="popup" :word="word" @restart="restart" />

    <!-- Уведомление -->
    <GameNotification ref="notification" />
  </div>
</template>
