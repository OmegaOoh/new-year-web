<template>
  <title>The Only Page</title>
  <canvas
    class="fixed -z-50 top-0 bottom-0 left-0 right-0"
    id="canvas"
  ></canvas>

  <!-- Consent Modal for External Links -->
  <dialog id="consent_modal" class="modal">
    <div class="modal-box size-fit max-w-md">
      <h3 class="text-lg font-bold mb-4">⚠️ Notice</h3>
      <div class="space-y-4 text-sm">
        <p>
          This application may display content from external websites that are
          <strong>not associated with our application</strong>.
        </p>
        <p>
          Please proceed with your own caution when interacting with any content
          that appears.
        </p>
        <p class="text-xs text-neutral-500 italic">
          This notice will only appear once.
        </p>
      </div>
      <div class="modal-action mt-6">
        <form method="dialog">
          <button class="btn btn-primary" @click="acceptConsent">
            I Understand, Continue
          </button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button></button>
    </form>
  </dialog>

  <div
    v-if="bNewYearPeriod"
    class="w-screen h-screen flex flex-col gap-5 items-center justify-center"
  >
    <h1 class="text-7xl font-bold text-center">Happy New Year | {{ year }}</h1>
    <!--Countdown-->
    <div
      v-if="year === new Date().getFullYear() + 1"
      class="grid auto-cols-max grid-flow-col gap-5 text-center bg-neutral py-2 px-5 rounded-lg"
    >
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
      <div class="modal-box size-fit max-w-2xl">
        <h3 class="text-lg font-bold">{{ randomQuote.title }}</h3>
        <p class="py-4 text-right">-{{ randomQuote.detail }}</p>
        <div v-if="surpriseUrl" class="mt-4 w-full h-96 border rounded">
          <iframe
            :src="surpriseUrl"
            class="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeSurprise()">close</button>
      </form>
    </dialog>
  </div>
  <!-- If not in new year period-->
  <div
    v-else
    class="w-screen h-screen flex flex-col gap-5 items-center justify-center"
  >
    <h1 class="text-9xl">Cooking Something...</h1>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { drawBackground } from "./functions/utils";
import { quotes, urls } from "./data/contentData";

const WEEK = 7 * 24 * 60 * 60 * 1000;
const BUBBLE_STYLE = "rgba(255, 255, 175, 0.5)";

const b4NewYear = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
const bNewYearPeriod = ref(false);
const year = ref(0);
let increment = 0;
const consentGiven = ref(false);
const surpriseUrl = ref(null);

const randomQuote = ref({ title: "", detail: "", surprise: false });

function getYear() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  return Math.abs(now - startOfYear) <= WEEK
    ? now.getFullYear()
    : now.getFullYear() + 1;
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
    surpriseUrl.value = getEmbedUrl(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
  }
  const modal = document.getElementById("my_modal");
  randomQuote.value = quotes[Math.floor(Math.random() * quotes.length)];
  surpriseUrl.value = null;

  // 25% chance of surprise if quote has surprise: true
  if (randomQuote.value.surprise && Math.random() < 0.25) {
    const url = urls[Math.floor(Math.random() * urls.length)];
    surpriseUrl.value = getEmbedUrl(url);
  }
  modal.showModal();
}

function getEmbedUrl(url) {
  // Handle youtu.be short links
  if (url.includes("youtu.be/")) {
    const videoId = url.match(/youtu\.be\/([^?&]+)/)?.[1];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // Handle youtube.com watch links
  if (url.includes("youtube.com/watch")) {
    const videoId = url.match(/v=([^&]+)/)?.[1];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // Handle youtube.com/shorts links
  if (url.includes("youtube.com/shorts/")) {
    const videoId = url.match(/shorts\/([^?&]+)/)?.[1];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // Return original URL for non-YouTube links (images, etc)
  return url;
}

function closeSurprise() {
  surpriseUrl.value = null;
}

function acceptConsent() {
  localStorage.setItem("externalLinksConsent", "true");
  consentGiven.value = true;
  const modal = document.getElementById("consent_modal");
  modal.close();
}

function checkConsent() {
  const hasConsent = localStorage.getItem("externalLinksConsent");
  if (hasConsent === "true") {
    consentGiven.value = true;
  } else {
    consentGiven.value = false;
  }
}

function initVar() {
  year.value = getYear();
  bNewYearPeriod.value =
    Math.abs(new Date().getTime() - new Date(year.value, 0, 1).getTime()) <=
    WEEK;
}

onMounted(() => {
  initVar();
  checkConsent();

  // Show consent modal if not already given
  if (!consentGiven.value) {
    const consentModal = document.getElementById("consent_modal");
    consentModal.showModal();
  }

  // Always render background
  const canvas = document.getElementById("canvas");
  drawBackground(canvas, BUBBLE_STYLE);
  window.addEventListener("resize", () => drawBackground(canvas, BUBBLE_STYLE));
  if (bNewYearPeriod.value) {
    document.title = `Happy New Year | ${year.value}`;
    b4NewYear.value = remTime();
    setInterval(() => {
      b4NewYear.value = remTime();
    }, 500);
  } else {
    document.title = `Cooking 🍳`;
  }
});

onBeforeMount(() => {
  const canvas = document.getElementById("canvas");
  window.removeEventListener("resize", () =>
    drawBackground(canvas, BUBBLE_STYLE)
  );
});
</script>
