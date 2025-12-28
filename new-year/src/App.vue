<template>
  <title>The Only Page</title>
  <canvas
    class="fixed -z-50 top-0 bottom-0 left-0 right-0"
    id="canvas"
  ></canvas>

  <!-- Consent Modal for External Links -->
  <dialog id="consent_modal" class="modal">
    <div class="modal-box size-fit max-w-md">
      <h3 class="text-lg font-bold">Notice: External Links</h3>
      <p class="py-4">
        This application may open new tabs to external websites that are not
        associated with our application. Please continue with your own caution.
      </p>
      <div class="modal-action">
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

const WEEK = 7 * 24 * 60 * 60 * 1000;
const BUBBLE_STYLE = "rgba(255, 255, 175, 0.5)";

const b4NewYear = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
const bNewYearPeriod = ref(false);
const year = ref(0);
let increment = 0;
const consentGiven = ref(false);
const surpriseUrl = ref(null);

const randomQuote = ref({ title: "", detail: "", surprise: false });

const quotes = [
  {
    title: "The best is yet to come.",
    detail: "Frank Sinatra",
    surprise: false,
  },
  {
    title: "Cheers to a new year and another chance for us to get it right.",
    detail: "Oprah Winfrey",
    surprise: false,
  },
  {
    title:
      "It's a new dawn. It's a new day. It's a new life, for me. And I'm feeling good.",
    detail: "Nina Simone",
    surprise: true,
  },
  {
    title:
      "The secret of change is to focus all of your energy, not on fighting the old, but on building the new.",
    detail: "Socrates",
    surprise: false,
  },
  {
    title: "The best way to predict the future is to create it.",
    detail: "Abraham Lincoln",
    surprise: false,
  },
  {
    title:
      "My New Year's resolution is to stop procrastinating, but I'll start that tomorrow.",
    detail: "Perplexity.ai ",
    surprise: true,
  },
  {
    title: "With the new day comes new strength and new thoughts.",
    detail: "Eleanor Roosevelt",
    surprise: false,
  },
  {
    title: "This is a new year. A new beginning. And things will change.",
    detail: "Taylor Swift",
    surprise: false,
  },
  {
    title:
      "Every single year, we're a different person. I don't think we're the same person all of our lives.",
    detail: "Steven Spielberg",
    surprise: true,
  },
  {
    title: "You are never too old to set another goal or to dream a new dream.",
    detail: "C.S. Lewis",
    surprise: false,
  },
  {
    title: "Your life does not get better by chance, it gets better by change.",
    detail: "Jim Rohn",
    surprise: false,
  },
  {
    title: "The journey of a thousand miles begins with one step.",
    detail: "Lao Tzu",
    surprise: true,
  },
  {
    title:
      "Cheers to a new year and another chance to get it right... or at least try not to mess it up too badly!",
    detail: "Perplexity.ai",
    surprise: false,
  },
  {
    title: "Every moment is a fresh beginning.",
    detail: "T.S. Eliot",
    surprise: false,
  },
  {
    title:
      "I can't believe it's been a year since I didn't become a better person.",
    detail: "Perplexity.ai",
    surprise: false,
  },
  {
    title:
      "May the New Year bring you all the success, happiness, and love you deserve.",
    detail: "Someone",
    surprise: false,
  },
  {
    title:
      "The new year stands before us, like a chapter in a book, waiting to be written.",
    detail: "Melody Beattie",
    surprise: true,
  },
  {
    title: "'Ring out the old, ring in the new.'",
    detail: "Neame of Alfred Tennyson's Music Sheet",
    surprise: false,
  },
  {
    title: "'New Year's Day is every man's birthday.'",
    detail: "Charles Lamb",
    surprise: false,
  },
  {
    title: "'Life is change. Growth is optional. Choose wisely.'",
    detail: "Karen Kaiser Clark",
    surprise: false,
  },
  {
    title:
      "'Each year's regrets are envelopes in which messages of hope are found for the new year.'",
    detail: "John R. Dallas Jr.",
    surprise: false,
  },
  {
    title:
      "'And suddenly you know: It's time to start something new and trust the magic of beginnings.'",
    detail: "Meister Eckhart",
    surprise: true,
  },
  {
    title: "May all your troubles last as long as your New Year's resolutions.",
    detail: "Perplexity.ai ",
    surprise: false,
  },
  {
    title: "This year, I will be more organized. Just not today.",
    detail: "Someone",
    surprise: true,
  },
];

const urls = [
  "https://youtu.be/4xnsmyI5KMQ?si=G5NT3FxSXBLO_PJe",
  "https://www.youtube.com/watch?v=7asJSW7yp7E",
  "https://youtu.be/Jd4Hd-HFgls?si=tteB4UU82YquGBz8",
  "https://www.youtube.com/shorts/1izGh371eLU?feature=share",
  "https://i.pinimg.com/736x/a8/75/03/a875036d44def0b055a0bfb6782658ae.jpg",
  "https://www.youtube.com/watch?v=F-Azl8KXa-0",
  "https://www.youtube.com/watch?v=P4XVvma2Iyc",
  "https://images-cdn.9gag.com/photo/axjZx1Y_700b.jpg",
  "https://youtu.be/ReXHwSS0r5U?si=n--MtzD2P0CsoZ6t",
  "",
];

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
    surpriseUrl.value=getEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
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
