(() => {
  const LEVELS = ["EASY", "MEDIUM", "HARD", "EXPERT"];
  const PER_WORD_TIME = { EASY: 6, MEDIUM: 4, HARD: 3, EXPERT: 2 };
  const LEVEL_UP_EVERY = 5;
  const GLOBAL_TIME = 60;

  // State
  let currentLevelIndex = 0;
  let currentWord = "";
  let score = 0;
  let wordsCorrectThisLevel = 0;
  let globalTimeLeft = GLOBAL_TIME;
  let wordTimeLeft = 0;

  // Intervals
  let globalTimerInterval = null;
  let wordTimerInterval = null;

  // Elements
  const wordDisplay = document.getElementById("word-display");
  const input = document.getElementById("text-input");
  const scoreSpan = document.getElementById("score");
  const levelSpan = document.getElementById("level");
  const globalTimerSpan = document.getElementById("global-timer");
  const wordTimerBar = document.getElementById("word-timer-bar");
  const startBtn = document.getElementById("start-btn");
  const overlay = document.getElementById("overlay");
  const restartBtn = document.getElementById("restart-btn");
  const finalScoreP = document.getElementById("final-score");
  const themeBtn = document.getElementById("theme-toggle");

  // Utility functions
  function updateHUD() {
    scoreSpan.textContent = `Score: ${score}`;
    levelSpan.textContent = `Level: ${LEVELS[currentLevelIndex]}`;
    globalTimerSpan.textContent = `Time: ${globalTimeLeft}`;
  }

  function pickRandomWord() {
    const level = LEVELS[currentLevelIndex];
    const list = WORD_BANK[level];
    return list[Math.floor(Math.random() * list.length)];
  }

  function startWordTimer() {
    clearInterval(wordTimerInterval);
    wordTimeLeft = PER_WORD_TIME[LEVELS[currentLevelIndex]];
    updateWordTimerBar();
    wordTimerInterval = setInterval(() => {
      wordTimeLeft -= 0.1;
      updateWordTimerBar();
      if (wordTimeLeft <= 0) {
        clearInterval(wordTimerInterval);
        endGame();
      }
    }, 100);
  }

  function updateWordTimerBar() {
    const max = PER_WORD_TIME[LEVELS[currentLevelIndex]];
    const pct = Math.max(wordTimeLeft, 0) / max * 100;
    wordTimerBar.style.width = pct + "%";
    if (pct > 60) {
      wordTimerBar.style.backgroundColor = "#4caf50";
    } else if (pct > 30) {
      wordTimerBar.style.backgroundColor = "#ffc107";
    } else {
      wordTimerBar.style.backgroundColor = "#f44336";
    }
  }

  function setNextWord() {
    currentWord = pickRandomWord();
    wordDisplay.textContent = currentWord;
    input.value = "";
    startWordTimer();
  }

  function startGlobalTimer() {
    clearInterval(globalTimerInterval);
    globalTimerInterval = setInterval(() => {
      globalTimeLeft--;
      globalTimerSpan.textContent = `Time: ${globalTimeLeft}`;
      if (globalTimeLeft <= 0) {
        clearInterval(globalTimerInterval);
        endGame();
      }
    }, 1000);
  }

  function startGame() {
    // Reset state
    currentLevelIndex = 0;
    score = 0;
    wordsCorrectThisLevel = 0;
    globalTimeLeft = GLOBAL_TIME;
    updateHUD();
    overlay.classList.add("hidden");
    input.disabled = false;
    input.focus();
    startBtn.disabled = true;

    setNextWord();
    startGlobalTimer();
  }

  function endGame() {
    clearInterval(globalTimerInterval);
    clearInterval(wordTimerInterval);
    input.disabled = true;
    startBtn.disabled = false;
    finalScoreP.textContent = `Your Score: ${score}`;
    overlay.classList.remove("hidden");
  }

  function handleInput() {
    if (input.value.trim().toLowerCase() === currentWord.toLowerCase()) {
      score++;
      wordsCorrectThisLevel++;

      // Level up check
      if (wordsCorrectThisLevel >= LEVEL_UP_EVERY && currentLevelIndex < LEVELS.length - 1) {
        currentLevelIndex++;
        wordsCorrectThisLevel = 0;
      }
      updateHUD();
      setNextWord();
    }
  }

  function applyTheme(theme){
    document.body.classList.toggle("dark", theme === "dark");
    themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);
  themeBtn.addEventListener("click", () => {
    const next = document.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });

  // Event listeners
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);
  input.addEventListener("input", handleInput);
})();

