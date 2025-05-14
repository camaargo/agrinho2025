'use strict';

// Dados do jogo: Questões, opções, pontos e feedback com emojis agrícolas
const questions = [
  {
    question: "1. Você vai plantar uma área para cultivar. Qual tipo de semente escolhe?",
    options: [
      { text: "🌾 Sementes convencionais com agrotóxicos", score: 0, feedback: "🚫 Uso de agrotóxicos pode prejudicar o solo e as pessoas." },
      { text: "🌱 Sementes orgânicas e naturais", score: 2, feedback: "🌿 Ótima escolha! Ajuda a preservar a biodiversidade." },
      { text: "🌽 Sementes híbridas melhoradas", score: 1, feedback: "⚠️ Sementes híbridas melhoram a produção, mas devemos cuidar dos impactos." }
    ]
  },
  {
    question: "2. Para cuidar da plantação, qual prática você adota?",
    options: [
      { text: "🧪 Uso intensivo de pesticidas", score: 0, feedback: "🚫 O uso excessivo prejudica o meio ambiente e a saúde." },
      { text: "🐞 Controle integrado com métodos naturais", score: 2, feedback: "🌼 Excelente! Usa métodos naturais para controlar pragas." },
      { text: "💧 Fertilizantes químicos variados", score: 1, feedback: "⚠️ Usados com moderação, fertilizantes químicos podem ajudar." }
    ]
  },
  {
    question: "3. Na colheita, como você transporta os alimentos até a cidade?",
    options: [
      { text: "🚛 Transporte poluente e irregular", score: 0, feedback: "🚫 Poluição prejudica a saúde e o planeta." },
      { text: "🚜 Transporte organizado com veículos eficientes", score: 2, feedback: "👍 Reduz impactos ambientais no transporte." },
      { text: "🚚 Transporte comum sem pensar no ambiente", score: 1, feedback: "⚠️ Pode ser melhor com escolhas sustentáveis." }
    ]
  },
  {
    question: "4. Na cidade, quais alimentos você escolhe para consumir?",
    options: [
      { text: "🍅 Produtos agrícolas locais e orgânicos", score: 2, feedback: "🌟 Valoriza o produtor e é mais saudável!" },
      { text: "🍟 Produtos industrializados e importados", score: 0, feedback: "🚫 Mais impacto ambiental e menos nutrientes." },
      { text: "🍞 Produtos baratos de grande produção", score: 1, feedback: "⚠️ Fique atento aos impactos negativos." }
    ]
  },
  {
    question: "5. Depois do consumo, o que você faz com os resíduos orgânicos?",
    options: [
      { text: "🗑️ Descarto no lixo comum", score: 0, feedback: "🚫 Aumenta o problema ambiental." },
      { text: "🌻 Faço compostagem para reutilizar como adubo", score: 2, feedback: "👏 Ajuda o solo e evita o desperdício!" },
      { text: "🔥 Queimo os resíduos", score: 0, feedback: "🚫 Gera gases poluentes prejudiciais." }
    ]
  }
];

const totalQuestions = questions.length;
let currentQuestionIndex = 0;
let score = 0;
let playerName = "";
let soundOn = true;

// Referências DOM
const loginSection = document.getElementById('login-section');
const gameSection = document.getElementById('game-section');
const resultSection = document.getElementById('result-section');

const loginBtn = document.getElementById('login-btn');
const inputName = document.getElementById('input-name');

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');

const finalMessageEl = document.getElementById('final-message');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

const progressBar = document.getElementById('progress');
const audioToggleBtn = document.getElementById('audio-toggle');
const soundOnIcon = audioToggleBtn.querySelector('.icon-sound-on');
const soundOffIcon = audioToggleBtn.querySelector('.icon-sound-off');

// Sons do jogo
const sounds = {
  click: new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg'),
  correct: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'),
  wrong: new Audio('https://actions.google.com/sounds/v1/cartoon/buzzer.ogg'),
  win: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg')
};
Object.values(sounds).forEach(s => s.volume = 0.3);

function playSound(name) {
  if(soundOn && sounds[name]){
    try {
      sounds[name].currentTime = 0;
      sounds[name].play();
    } catch {}
  }
}

function toggleSound() {
  soundOn = !soundOn;
  audioToggleBtn.setAttribute('aria-pressed', String(soundOn));
  if(soundOn) {
    soundOnIcon.style.display = '';
    soundOffIcon.style.display = 'none';
    audioToggleBtn.title = 'Desativar sons';
    audioToggleBtn.setAttribute('aria-label', 'Desativar sons do jogo');
  } else {
    soundOnIcon.style.display = 'none';
    soundOffIcon.style.display = '';
    audioToggleBtn.title = 'Ativar sons';
    audioToggleBtn.setAttribute('aria-label', 'Ativar sons do jogo');
  }
}

// Inicia o jogo depois do login
function startGame() {
  playerName = inputName.value.trim();
  if(playerName.length < 2){
    alert("Por favor, digite seu nome para jogar.");
    inputName.focus();
    return;
  }
  playSound('click');
  loginSection.classList.remove('active-section');
  gameSection.classList.add('active-section');
  resultSection.classList.remove('active-section');

  currentQuestionIndex = 0;
  score = 0;
  feedbackEl.textContent = '';
  nextBtn.style.display = 'none';
  updateProgress();
  showQuestion();
}

// Atualiza barra de progresso
function updateProgress() {
  const progressPercent = ((currentQuestionIndex)/totalQuestions)*100;
  progressBar.style.width = progressPercent + '%';
}

function showQuestion() {
  feedbackEl.textContent = '';
  nextBtn.style.display = 'none';
  optionsEl.innerHTML = '';
  updateProgress();
  const currentQ = questions[currentQuestionIndex];
  questionEl.textContent = currentQ.question;
  currentQ.options.forEach((option, idx) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.type = 'button';
    // Emoji antes do texto
    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'option-emoji';
    emojiSpan.textContent = option.text.slice(0, 2).trim(); // pega emoji
    btn.appendChild(emojiSpan);
    const textSpan = document.createElement('span');
    textSpan.textContent = option.text.slice(2).trim();
    btn.appendChild(textSpan);
    btn.disabled = false;
    btn.setAttribute('role', 'listitem');
    btn.addEventListener('click', () => selectOption(idx));
    optionsEl.appendChild(btn);
  });
}

function selectOption(selectedIndex) {
  playSound('click');
  const currentQ = questions[currentQuestionIndex];
  const selectedOption = currentQ.options[selectedIndex];

  [...optionsEl.children].forEach((btn, idx) => {
    btn.disabled = true;
    if(idx === selectedIndex){
      btn.style.backgroundColor = "#4caf50";
      btn.style.color = "#fff";
      btn.style.borderColor = "#367c2b";
      btn.style.boxShadow = "inset 0 0 8px #285a18";
    }
  });

  score += selectedOption.score;

  feedbackEl.textContent = selectedOption.feedback + (selectedOption.score === 2 ? " ✅" : selectedOption.score === 1 ? " ⚠️" : " ❌");
  if(selectedOption.score === 2){
    playSound('correct');
  } else if(selectedOption.score === 1){
    playSound('wrong');
  } else {
    playSound('wrong');
  }
  nextBtn.style.display = 'inline-block';
}

function nextQuestion() {
  playSound('click');
  currentQuestionIndex++;
  if(currentQuestionIndex < totalQuestions){
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  playSound('win');
  gameSection.classList.remove('active-section');
  resultSection.classList.add('active-section');
  updateProgress();
  progressBar.style.width = "100%";
  let finalMsg = "";
  let emoji = "";
  if(score >= 8) {
    finalMsg = "Você fez escolhas muito conscientes e ajudou a festejar a conexão campo-cidade com sustentabilidade!";
    emoji = "🎉🌻🌳";
  } else if(score >= 4) {
    finalMsg = "Bom trabalho! Você entendeu a importância das escolhas sustentáveis, mas sempre dá para melhorar.";
    emoji = "👍🍃";
  } else {
    finalMsg = "Vamos aprender mais? Suas escolhas podem ajudar muito para cuidar melhor do meio ambiente e da saúde de todos.";
    emoji = "🌍🍂";
  }
  finalMessageEl.textContent = `${emoji}\nParabéns, ${playerName}!`;
  scoreEl.textContent = `Sua pontuação: ${score} / ${totalQuestions * 2}\n${finalMsg}`;
}

function restartGame() {
  playSound('click');
  // Reset interface voltando ao login para outro jogador
  resultSection.classList.remove('active-section');
  loginSection.classList.add('active-section');
  gameSection.classList.remove('active-section');
  inputName.value = "";
  inputName.focus();
  feedbackEl.textContent = "";
  nextBtn.style.display = "none";
  progressBar.style.width = "0%";
  scoreEl.textContent = "";
  finalMessageEl.textContent = "";
}

// Eventos
loginBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartGame);
audioToggleBtn.addEventListener('click', () => toggleSound());

// Enter key suporte para login
inputName.addEventListener('keydown', e => {
  if(e.key === 'Enter'){
    e.preventDefault();
    startGame();
  }
});