// OPEN LINKS
function openLink(url) {
    window.open(url, '_blank');
}

// UPDATE PROGRESS + SAVE
function updateProgress() {
    let val = document.getElementById("progressInput").value;

    if (!val || val < 0) return;

    localStorage.setItem("progress", val);    

    let percent = Math.min((val / 500) * 100, 100);

    document.getElementById("progressBar").style.width = percent + "%";
    document.getElementById("progressText").innerText =
        val + " problems solved (" + Math.floor(percent) + "%)";
}

// LOAD SAVED DATA
window.onload = function () {
    let saved = localStorage.getItem("progress");

    if (saved) {
        let percent = Math.min((saved / 500) * 100, 100);

        document.getElementById("progressBar").style.width = percent + "%";
        document.getElementById("progressText").innerText =
            saved + " problems solved (" + Math.floor(percent) + "%)";
    }
};

// TODO APP
function addTask() {
    let taskInput = document.getElementById("task");

    if (!taskInput || taskInput.value.trim() === "") return;

    let li = document.createElement("li");
    li.innerText = taskInput.value;

    document.getElementById("list").appendChild(li);

    taskInput.value = ""; // clear input
}

// WEATHER API (SAFE VERSION)
async function getWeather() {
    try {
        let city = "Delhi";
        let apiKey = "YOUR_API_KEY"; // replace this

        let res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        let data = await res.json();

        console.log("Weather:", data.name, data.main.temp + "°C");
    } catch (error) {
        console.log("Weather error:", error);
    }
}

getWeather();