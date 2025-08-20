<script setup lang="ts">
import GameFigure from './components/GameFigure.vue'
import GameHeader from './components/GameHeader.vue'
import GamePopup from './components/GamePopup.vue'
import GameWord from './components/GameWord.vue'
import GameWrongLetters from './components/GameWrongLetters.vue'
import GameNotification from './components/GameNotification.vue'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
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

// Ссылка на скрытое поле для мобильных
const hiddenInput = ref<HTMLInputElement | null>(null)

// Обработка ввода через нативное поле (мобильные устройства)
const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const key = input.value.trim().toLowerCase()
  if (!key) return
  processLetter(key)
  input.value = ''
}

// Общий обработчик буквы
const processLetter = (key: string) => {
  if (isLose.value || isWin.value) return

  if (letters.value.includes(key)) {
    notification.value?.open()
    setTimeout(() => notification.value?.close(), 2000)
    return
  }

  if (/[а-яё]/i.test(key)) {
    letters.value.push(key)
  }
}

// Обработка клавиш с ПК
const handleKeydown = (event: KeyboardEvent) => {
  processLetter(event.key.toLowerCase())
}

// Перезапуск игры
const restart = async () => {
  await getRandomWord()
  letters.value = []
  popup.value?.close()
}

// Фокус на поле при клике на мобильных
const focusInput = () => {
  hiddenInput.value?.focus()
}

// Подписываемся на событие клавиатуры
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div id="app" @click="focusInput" style="min-height:100vh;">
    <GameHeader />

    <div class="game-container">
      <GameFigure :wrong-letters-count="wrongLetters.length" />
      <GameWrongLetters :wrong-letters="wrongLetters" />
      <GameWord :word="word" :correct-letters="correctLetters" />
    </div>

    <!-- Скрытое поле для мобильных -->
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
