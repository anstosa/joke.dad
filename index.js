// returns a stable hash based on an input string
const hashString = async (source) => {
  console.debug(`⌛ Hashing ${source}...`);
  const sourceBytes = new TextEncoder().encode(source);
  const digest = await crypto.subtle.digest("SHA-256", sourceBytes);
  const resultBytes = [...new Uint32Array(digest)];
  const hash = resultBytes
    .map((x) => x.toString(36))
    .join("")
    .substring(0, 10)
    .toUpperCase();
  console.debug(`🤖 Hash: ${hash}`);
  return hash;
};

// returns a random element from an array
const pickRandom = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  const randomItem = array[randomIndex];
  console.debug(`😵‍💫 Picked random index ${randomIndex}`, randomItem, array);
  return randomItem;
};

// get hash from URL
const getHash = () => {
  console.debug("#️⃣ Reading hash from URL...", window.location);
  const rawHash = window.location.hash;
  if (rawHash.length <= 1) {
    console.debug("✖️ No hash in URL");
    return;
  }
  const hash = rawHash.substring(1);
  console.debug(`✅ Hash: ${hash}`);
  return hash;
};

// set hash in URL
const setHash = (hash) => {
  window.location.hash = hash;
  console.debug(`#️⃣ Set URL hash to ${hash}`, window.location);
};

// returns a hash for a given joke
const hashJoke = async (joke) => {
  console.info(`⌛ Hashing joke "${joke.setup} ${joke.punchline}"...`);
  const input = `${joke.setup}-${joke.punchline}`;
  const result = await hashString(input);
  console.info(`🤖 Hash: ${result}`);
  return result;
};

// cached version of jokes.json so we don't fetch it more than once
let _jokes = undefined;

// getter that returns the cached jokes if available, otherwise requests them
const getJokes = async () => {
  if (typeof _jokes === "undefined") {
    _jokes = await fetchJokes();
  }
  return _jokes;
};

// getter that fetches the jokes.json file
const fetchJokes = async () => {
  console.info("⌛ Fetching jokes...");
  const response = await fetch("/jokes.json");
  const jokes = await response.json();
  console.info(`✅ Fetched ${jokes.length} jokes!`);
  return jokes;
};

// gets a joke by its hash
const getJokeByHash = async (targetHash) => {
  console.debug(`🔍 Searching for joke "${targetHash}"`);
  const jokes = await getJokes();
  for (let index = 0; index <= jokes.length; index++) {
    const joke = jokes[index];
    const hash = await hashJoke(joke);
    if (hash === targetHash) {
      console.debug(`✅ ${hash}`, joke);
      return joke;
    } else {
      console.debug(`❌ ${hash}`, joke);
    }
  }
  return;
};

// get a random joke
const getRandomJoke = async () => {
  const jokes = await getJokes();
  return pickRandom(jokes);
};

// update the DOM with a given joke
const renderJoke = (joke) => {
  console.info("🎨 Rendering...");
  const setup = document.querySelector(".js-setup");
  const punchline = document.querySelector(".js-punchline");
  const background = document.querySelector(".js-background");
  punchline.classList.remove("js-animate");

  setup.textContent = joke.setup;
  punchline.textContent = joke.punchline;
  background.style.backgroundImage = `url(${joke.gif})`;
  setTimeout(() => punchline.classList.add("js-animate"));
  console.info("✅ Done!");
};

// fetches a new random joke and updates the
const refreshJoke = async () => {
  joke = await getRandomJoke();
  hash = await hashJoke(joke);
  if (hash === getHash()) {
    return refreshJoke();
  }
  renderJoke(joke);
  setHash(hash);
};

// initialize page
(async () => {
  let joke = undefined;
  let hash = getHash();
  if (hash) {
    joke = await getJokeByHash(hash);
    renderJoke(joke);
  } else {
    await refreshJoke();
  }

  const shuffle = document.querySelector(".js-shuffle");
  shuffle.addEventListener("click", refreshJoke);
})();
