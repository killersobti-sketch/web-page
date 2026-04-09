let allQuestions = [];
let currentQuestions = [];
let currentIndex = 0;
let timer;
let timeLeft = 60;

// 🔥 FETCH
async function loadQuestions() {
  const res = await fetch("questions.json");
  allQuestions = await res.json();
  loadFilteredQuestions();
}

// 🎯 FILTER + LOAD
function loadFilteredQuestions() {
  const course = document.getElementById("courseSelect").value;
  const pyq = document.getElementById("pyqSelect").value;
  const category = document.getElementById("categorySelect").value;

  document.getElementById("activeFilter").innerText =
    `Course: ${course || "All"} | PYQ: ${pyq || "All"} | Category: ${category || "All"}`;

  currentQuestions = allQuestions.filter(q => {

    if (pyq) {
      return q.type === "pyq" && q.course === pyq &&
             (category ? q.category === category : true);
    }

    return (course ? q.course === course : true) &&
           q.type === "course" &&
           (category ? q.category === category : true);
  });

  renderSlider();
}

// 🔥 RENDER SLIDER
function renderSlider() {
  const slider = document.getElementById("questionSlider");
  slider.innerHTML = "";
  currentIndex = 0;

  currentQuestions.forEach((q, i) => {

    let optionsHTML = q.options.map((opt, index) => `
      <label>
        <input type="radio" name="q${i}" value="${index}">
        ${opt}
      </label>
    `).join("");

    const div = document.createElement("div");
    div.className = "question-box";

    div.innerHTML = `
      <h4>Q${i + 1}: ${q.question}</h4>
      <small>${q.category}</small>
      ${optionsHTML}
    `;

    slider.appendChild(div);
  });

  updateSlider();
  startTimer();
}

// 🎯 SLIDER MOVE
function updateSlider() {
  const slider = document.getElementById("questionSlider");
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function nextQuestion() {
  if (currentIndex < currentQuestions.length - 1) {
    currentIndex++;
    updateSlider();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
}

// ⏱ TIMER
function startTimer() {
  clearInterval(timer);
  timeLeft = 60;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      submitQuiz();
    }
  }, 1000);
}

// ✅ SUBMIT
function submitQuiz() {

  if (document.querySelectorAll("input[type='radio']:checked").length === 0) {
    alert("⚠️ Attempt at least one question");
    return;
  }

  clearInterval(timer);

  let correct = 0;

  currentQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);

    if (selected && parseInt(selected.value) === q.correctAnswer) {
      correct++;
    }
  });

  let total = currentQuestions.length;
  let wrong = total - correct;
  let percentage = ((correct / total) * 100).toFixed(2);
  renderChart(correct, wrong);
  renderCharts(correct, wrong);

  // 🔥 Update dashboard values
  document.getElementById("totalQ").innerText = total;
  document.getElementById("correctQ").innerText = correct;
  document.getElementById("wrongQ").innerText = wrong;
  document.getElementById("percentQ").innerText = percentage + "%";

  // 🔥 Show dashboard
  document.getElementById("resultDashboard").classList.remove("hidden");
}
// EVENTS
document.getElementById("courseSelect").addEventListener("change", loadFilteredQuestions);
document.getElementById("pyqSelect").addEventListener("change", loadFilteredQuestions);
document.getElementById("categorySelect").addEventListener("change", loadFilteredQuestions);

// INIT
loadQuestions();




let chartInstance = null;

function renderChart(correct, wrong) {

  const ctx = document.getElementById("resultChart");

  // 🔥 old chart destroy (important)
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Correct", "Wrong"],
      datasets: [{
        label: "Performance",
        data: [correct, wrong],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    },
    options: {
      animation: {
        duration: 1000
      },
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
let barChartInstance = null;
let pieChartInstance = null;

function renderCharts(correct, wrong) {

  const barCtx = document.getElementById("barChart");
  const pieCtx = document.getElementById("pieChart");

  // 🔥 destroy old charts
  if (barChartInstance) barChartInstance.destroy();
  if (pieChartInstance) pieChartInstance.destroy();

  // 📊 BAR CHART
  barChartInstance = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["Correct", "Wrong"],
      datasets: [{
        data: [correct, wrong],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    },
    options: {
      animation: { duration: 800 },
      plugins: { legend: { display: false } }
    }
  });

  // 🥧 PIE CHART
  pieChartInstance = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["Correct", "Wrong"],
      datasets: [{
        data: [correct, wrong],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    },
    options: {
      animation: { duration: 800 }
    }
  });
}