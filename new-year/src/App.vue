<template>
  <title>Happy New Year | {{ year }}</title>
  <canvas class="fixed top-0 bottom-0 left-0 right-0" id="canvas"></canvas>
  <button class="btn btn-primary">Click Me!</button>
</template>

<script setup>
import { onMounted, onBeforeMount } from 'vue'

let year = new Date().getFullYear()
const BUBBLE_STYLE = 'rgba(173, 216, 230, 0.5)'

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


onMounted(() => {
  drawBackground()
  window.addEventListener('resize', drawBackground)
})

onBeforeMount(() => {
  window.removeEventListener('resize', drawBackground)
})
</script>