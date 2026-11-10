// ============================================================
// 👉 EDIT HERE: YOUR 3 QUESTIONS
// Each block below is one question. For every question you set:
//   question      -> the mystery/question shown to the user
//   expectedInput -> what the user must type to solve it
//                    (uppercase, extra spaces and accents are ignored)
//   answer        -> the text revealed ONLY when the input is correct
//   hints         -> revealed one by one, only while THIS question is open
// To add a 4th question, copy a whole { ... } block and keep the comma.
// ============================================================
const QUESTIONS = [
  {
    // 👉 QUESTION 1: the mystery shown to the user
    question: "Qual a resposta do enigma sobre QUEM MORREU?.",

    // 👉 QUESTION 1: the EXPECTED INPUT (what the user must type)
    expectedInput: "#b302ef",

    // 👉 QUESTION 1: the ANSWER revealed when the input is correct
    answer: "Pedro Girotto MORREU :c",

    // 👉 QUESTION 1: the HINTS (keep the quotes and the commas)
    hints: [
      "DICA: HEX",
    ]
  },
  {
    // 👉 QUESTION 3: the mystery shown to the user
    question: "Qual a resposta do enigma para QUEM MATOU",

    // 👉 QUESTION 3: the EXPECTED INPUT (what the user must type)
    expectedInput: "d a n i l o",

    // 👉 QUESTION 3: the ANSWER revealed when the input is correct
    answer: "Danilo MATOU :o",

    // 👉 QUESTION 3: the HINTS (keep the quotes and the commas)
    hints: [
      "Binário -> BACON -> resposta.",
    ]
  }
];

// ---------- Optional: feedback messages ----------
const CORRECT_MESSAGE = "Correto!";
const WRONG_MESSAGES = [
  "Não é isso. Talvez uma dica ajude."
];

// ============================================================
// Code below: no need to edit
// ============================================================
const tabsNav = document.getElementById("question-tabs");
const questionText = document.getElementById("question-text");
const form = document.getElementById("mystery-form");
const input = document.getElementById("answer-input");
const submitBtn = form.querySelector("button[type='submit']");
const feedback = document.getElementById("feedback");
const answerBox = document.getElementById("answer-box");
const answerText = document.getElementById("answer-text");
const hintBtn = document.getElementById("hint-btn");
const hintBox = document.getElementById("hint-box");

// Each question remembers its own progress while the user switches between them
const state = QUESTIONS.map(() => ({ solved: false, hintsShown: 0, typed: "" }));
let current = 0;

// Lowercase, trim, collapse spaces and remove accents before comparing
const normalize = (text) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, " ");

// One button per question
const tabs = QUESTIONS.map((_, i) => {
  const tab = document.createElement("button");
  tab.type = "button";
  tab.className = "tab";
  tab.textContent = `Question ${i + 1}`;
  tab.addEventListener("click", () => showQuestion(i));
  tabsNav.appendChild(tab);
  return tab;
});

function addHintToBox(text) {
  const p = document.createElement("p");
  p.textContent = text;
  hintBox.appendChild(p);
}

function updateHintButton() {
  const total = QUESTIONS[current].hints.length;
  const shown = state[current].hintsShown;
  hintBtn.disabled = shown >= total;
  hintBtn.textContent =
    shown >= total ? "No more hints"
    : shown === 0 ? "Show a hint"
    : `Show next hint (${shown}/${total})`;
}

// Draws the selected question: its text, hints, answer and progress
function showQuestion(index) {
  current = index;
  const q = QUESTIONS[index];
  const s = state[index];

  tabs.forEach((tab, i) => {
    tab.setAttribute("aria-current", String(i === index));
    tab.classList.toggle("solved", state[i].solved);
  });

  questionText.textContent = q.question;
  input.value = s.typed;
  input.disabled = s.solved;
  submitBtn.disabled = s.solved;
  input.classList.remove("shake");

  feedback.textContent = s.solved ? CORRECT_MESSAGE : "";
  feedback.className = s.solved ? "correct" : "";
  answerText.textContent = s.solved ? q.answer : "";
  answerBox.classList.toggle("hidden", !s.solved);

  // Only the hints that belong to this question
  hintBox.innerHTML = "";
  q.hints.slice(0, s.hintsShown).forEach(addHintToBox);
  hintBox.classList.toggle("hidden", s.hintsShown === 0);
  updateHintButton();
}

input.addEventListener("input", () => {
  state[current].typed = input.value;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const q = QUESTIONS[current];
  const s = state[current];

  if (normalize(input.value) === normalize(q.expectedInput)) {
    s.typed = input.value;
    s.solved = true;
    showQuestion(current);
  } else {
    feedback.textContent = WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
    feedback.className = "wrong";
    input.classList.remove("shake");
    void input.offsetWidth; // restarts the shake animation
    input.classList.add("shake");
    input.select();
  }
});

hintBtn.addEventListener("click", () => {
  const s = state[current];
  const hints = QUESTIONS[current].hints;
  if (s.hintsShown >= hints.length) return;

  addHintToBox(hints[s.hintsShown]);
  hintBox.classList.remove("hidden");
  s.hintsShown++;
  updateHintButton();
});

showQuestion(0);
