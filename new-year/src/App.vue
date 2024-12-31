<template>
  <title>The Only Page</title>
  <canvas class="fixed -z-50 top-0 bottom-0 left-0 right-0" id="canvas"></canvas>
  <div v-if="bNewYearPeriod" class="w-screen h-screen flex flex-col gap-5 items-center justify-center">
    <h1 class="text-7xl font-bold text-center">Happy New Year | {{ year }}</h1>
    <!--Countdown-->
    <div v-if="year === (new Date()).getFullYear() + 1" class="grid auto-cols-max grid-flow-col gap-5 text-center">
      <div class="flex flex-col items-center bg-neutral p-4 rounded-lg">
        <span class="text-4xl font-bold">{{ b4NewYear.days }}</span>
        <span class="text-lg">Days</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-4xl font-bold">{{ b4NewYear.hours }}</span>
        <span class="text-lg">Hours</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-4xl font-bold">{{ b4NewYear.minutes }}</span>
        <span class="text-lg">Minutes</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-4xl font-bold">{{ b4NewYear.seconds }}</span>
        <span class="text-lg">Seconds</span>
      </div>
    </div>

    <button class="btn btn-primary" onclick="my_modal.showModal()">Click Me!</button>
    <dialog id="my_modal" class="modal">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Hey!</h3>
          <p class="py-4">Some Random Quote for Visitor</p>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
    </dialog>
  </div>
  <!-- If not in new year period-->
  <div v-else class="w-screen h-screen flex flex-col gap-5 items-center justify-center">
    <h1 class="text-9xl">Cooking Something...</h1>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'


const WEEK = 7 * 24 * 60 * 60 * 1000;
const BUBBLE_STYLE = 'rgba(255, 255, 175, 0.5)'

const b4NewYear = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
const bNewYearPeriod = ref(false);
const year = ref(0);

function getYear() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  return Math.abs(now - startOfYear) <= WEEK ? now.getFullYear() : now.getFullYear() + 1;
}

function remTime() {
  const now = new Date();
  const newYear = new Date(year.value, 0, 1);
  const diff = newYear - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function drawBackground() {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  const bubbles = []
  
  function createBubble() {
    const size = Math.random() * 20 + 10
    const x = Math.random() * canvas.width
    const y = canvas.height + size
    const speed = Math.random() * 2 + 1
    bubbles.push({ x, y, size, speed })
  }

  function updateBubbles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < bubbles.length; i++) {
      const bubble = bubbles[i]
      bubble.y -= bubble.speed
      ctx.beginPath()
      ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)
      ctx.fillStyle = BUBBLE_STYLE
      ctx.fill()
      ctx.closePath()
      if (bubble.y + bubble.size < 0) {
        bubbles.splice(i, 1)
        i--
      }
    }
  }

  function animate() {
    updateBubbles()
    requestAnimationFrame(animate)
  }

  setInterval(createBubble, 250)
  animate()
}

function initVar() {
  year.value = getYear();
  bNewYearPeriod.value = Math.abs(new Date().getTime() - new Date(year.value, 0, 1).getTime()) <= WEEK;
}

onMounted(() => {
  initVar();
  // Always render background
  drawBackground()
  window.addEventListener('resize', drawBackground)

  if (bNewYearPeriod.value) {
    document.title = `Happy New Year | ${year.value}`;
    b4NewYear.value = remTime();
    setInterval(() => {b4NewYear.value = remTime()}, 500)
  }
  else {
    document.title = `Cooking 🍳`;
  }
})

onBeforeMount(() => {
  window.removeEventListener('resize', drawBackground)
})
</script>