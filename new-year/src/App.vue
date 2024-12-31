<template>
  <title>The Only Page</title>
  <canvas class="fixed -z-50 top-0 bottom-0 left-0 right-0" id="canvas"></canvas>
  <div v-if="bNewYearPeriod" class="w-screen h-screen flex flex-col gap-5 items-center justify-center">
    <h1 class="text-7xl font-bold text-center">Happy New Year | {{ year }}</h1>
    <!--Countdown-->
    <div v-if="year === (new Date()).getFullYear() + 1" class="grid auto-cols-max grid-flow-col gap-5 text-center bg-neutral py-2 px-5 rounded-lg">
      <div class="flex flex-col items-center">
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

    <button class="btn btn-primary" @click="showModal()">Click Me!</button>
    <dialog id="my_modal" class="modal">
        <div class="modal-box size-fit">
          <h3 class="text-lg font-bold">{{randomQuote.title}}</h3>
            <p class="py-4 text-right">-{{randomQuote.detail}}</p>
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
import { drawBackground } from './functions/utils'

const WEEK = 7 * 24 * 60 * 60 * 1000;
const BUBBLE_STYLE = 'rgba(255, 255, 175, 0.5)'

const b4NewYear = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
const bNewYearPeriod = ref(false);
const year = ref(0);
let increment = 0;

const randomQuote = ref({ title: '', detail: '' });

const quotes = [
  { "title": "The best is yet to come.", "detail": "Frank Sinatra" },
  { "title": "Cheers to a new year and another chance for us to get it right.", "detail": "Oprah Winfrey" },
  { "title": "It's a new dawn. It's a new day. It's a new life, for me. And I'm feeling good.", "detail": "Nina Simone" },
  { "title": "The secret of change is to focus all of your energy, not on fighting the old, but on building the new.", "detail": "Socrates" },
  { "title": "The best way to predict the future is to create it.", "detail": "Abraham Lincoln" },
  { "title": "With the new day comes new strength and new thoughts.", "detail": "Eleanor Roosevelt" },
  { "title": "This is a new year. A new beginning. And things will change.", "detail": "Taylor Swift" },
  { "title": "Every single year, we're a different person. I don't think we're the same person all of our lives.", "detail": "Steven Spielberg" },
  { "title": "You are never too old to set another goal or to dream a new dream.", "detail": "C.S. Lewis" },
  { "title": "Your life does not get better by chance, it gets better by change.", "detail": "Jim Rohn" },
  { "title": "The journey of a thousand miles begins with one step.", "detail": "Lao Tzu" },
  { "title": "Every moment is a fresh beginning.", "detail": "T.S. Eliot" },
  { "title": "I can't believe it's been a year since I didn't become a better person.", "detail": "Perplexity.ai" },
  { "title": "May the New Year bring you all the success, happiness, and love you deserve.", "detail": "Someone" },
  { "title": "The new year stands before us, like a chapter in a book, waiting to be written.", "detail": "Melody Beattie" },
  { "title": "'Ring out the old, ring in the new.'", "detail": "Neame of Alfred Tennyson's Music Sheet" },
  { "title": "'New Year's Day is every man's birthday.'", "detail": "Charles Lamb" },
  { "title": "'Life is change. Growth is optional. Choose wisely.'", "detail": "Karen Kaiser Clark" },
  { "title": "'Each year's regrets are envelopes in which messages of hope are found for the new year.'", "detail": "John R. Dallas Jr." },
  { "title": "'And suddenly you know: It's time to start something new and trust the magic of beginnings.'", "detail": "Meister Eckhart" },
  { "title": "My New Year's resolution is to stop procrastinating, but I'll start that tomorrow.", "detail": "Perplexity.ai" },
  { "title": "Cheers to a new year and another chance to get it right... or at least try not to mess it up too badly!", "detail": "Perplexity.ai" },
  { "title": "May all your troubles last as long as your New Year's resolutions.", "detail": "Perplexity.ai" },
  { "title": "This year, I will be more organized. Just not today.", "detail": "Someone" }
]


const urls = [
  "https://youtu.be/dQw4w9WgXcQ",
  "https://youtu.be/4xnsmyI5KMQ?si=G5NT3FxSXBLO_PJe",
  "https://www.youtube.com/watch?v=7asJSW7yp7E",
  "https://youtu.be/Jd4Hd-HFgls?si=tteB4UU82YquGBz8",
  "https://www.youtube.com/shorts/1izGh371eLU?feature=share",
  "https://i.pinimg.com/736x/a8/75/03/a875036d44def0b055a0bfb6782658ae.jpg",

]

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

function showModal() {
  ++increment;
  console.log(increment);
  if (increment % 69 == 0 && increment != 0) {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank').focus();
  }
  const modal = document.getElementById('my_modal');
  randomQuote.value = quotes[Math.floor(Math.random() * quotes.length)];
  if (randomQuote.value.detail === "Perplexity.ai") {
    const url = urls[Math.floor(Math.random() * urls.length)];
    window.open(url, '_blank').focus();

  }
  modal.showModal();
}

function initVar() {
  year.value = getYear();
  bNewYearPeriod.value = Math.abs(new Date().getTime() - new Date(year.value, 0, 1).getTime()) <= WEEK;
}

onMounted(() => {
  initVar();
  // Always render background
  const canvas = document.getElementById('canvas')
  drawBackground(canvas, BUBBLE_STYLE)
  window.addEventListener('resize', () => drawBackground(canvas, BUBBLE_STYLE));
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
  const canvas = document.getElementById('canvas')
  window.removeEventListener('resize', () => drawBackground(canvas, BUBBLE_STYLE))
  }
  );
</script>