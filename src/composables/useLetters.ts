import { computed, ref, type Ref } from 'vue'

export const useLetters = (word: Ref<string>) => {
  const letters = ref<string[]>([])
  const correctLetters = computed(() => letters.value.filter((x) => word.value.includes(x)))
  const wrongLetters = computed(() => letters.value.filter((x) => !word.value.includes(x)))
  const isLose = computed(() => wrongLetters.value.length === 6)
  const isWin = computed(() => [...word.value].every(x => correctLetters.value.includes(x)))

  return {
    letters,
    correctLetters,
    wrongLetters,
    isLose,
    isWin
  }
}
