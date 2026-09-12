const startScreen = document.getElementById("startScreen");
const destinationScreen = document.getElementById("destinationScreen");
const exploreScreen = document.getElementById("exploreScreen");
const resultScreen = document.getElementById("resultScreen");

const startButton = document.getElementById("startButton");
const exploreButton = document.getElementById("exploreButton");
const finishButton = document.getElementById("finishButton");
const againButton = document.getElementById("againButton");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const smallDestination = document.getElementById("smallDestination");
const destinationCode = document.getElementById("destinationCode");
const destinationCity = document.getElementById("destinationCity");
const layoverTime = document.getElementById("layoverTime");
const gate = document.getElementById("gate");
const departureTime = document.getElementById("departureTime");

const places = document.getElementById("places");
const timer = document.getElementById("timer");
const timeStat = document.getElementById("timeStat");
const moneyStat = document.getElementById("moneyStat");
const happinessStat = document.getElementById("happinessStat");

const resultCity = document.getElementById("resultCity");
const resultSubtitle = document.getElementById("resultSubtitle");
const placesVisited = document.getElementById("placesVisited");
const timeSpent = document.getElementById("timeSpent");
const moneySpent = document.getElementById("moneySpent");
const finalHappiness = document.getElementById("finalHappiness");
const memoryCity = document.getElementById("memoryCity");
const memoryText = document.getElementById("memoryText");

let currentLocation = null;
let timeLeft = 0;
let startingTime = 0;
let money = 45;
let happiness = 50;
let visited = [];
let timerInterval = null;

function showScreen(screen) {
    startScreen.classList.add("hidden");
    destinationScreen.classList.add("hidden");
    exploreScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    screen.classList.remove("hidden");
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function formatSpentTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${String(mins).padStart(2, "0")}m`;
}

function updateStats() {
    timer.textContent = formatTime(timeLeft);
    timeStat.textContent = formatTime(timeLeft);
    moneyStat.textContent = `€${money}`;
    happinessStat.textContent = happiness;
}

function pickLocation() {
    currentLocation = locations[Math.floor(Math.random() * locations.length)];

    cityName.textContent = currentLocation.city;
    countryName.textContent = currentLocation.country;
    smallDestination.textContent = currentLocation.code;
    destinationCode.textContent = currentLocation.code;
    destinationCity.textContent = currentLocation.city;
    layoverTime.textContent = formatTime(currentLocation.layover);
    gate.textContent = currentLocation.gate;
    departureTime.textContent = currentLocation.departure;

    timeLeft = currentLocation.layover;
    startingTime = currentLocation.layover;
    money = 45;
    happiness = 50;
    visited = [];

    updateStats();
    renderPlaces();
}

function renderPlaces() {
    places.innerHTML = "";

    currentLocation.places.forEach((place, index) => {
        const card = document.createElement("button");
        card.className = "place";
        card.type = "button";

        card.innerHTML = `
            <div class="place-top">
                <span class="place-icon">${place.icon}</span>
                <span class="place-time">${place.time} MIN</span>
            </div>
            <div>
                <h3>${place.name}</h3>
                <p>${place.description}</p>
            </div>
            <div class="place-bottom">
                <span class="place-cost">€${place.cost}</span>
                <span class="place-happiness">+${place.happiness} happiness</span>
            </div>
        `;

        card.addEventListener("click", () => visitPlace(place, card, index));
        places.appendChild(card);
    });
}

function visitPlace(place, card, index) {
    if (visited.includes(index)) {
        return;
    }

    if (place.time > timeLeft || place.cost > money) {
        return;
    }

    timeLeft -= place.time;
    money -= place.cost;
    happiness += place.happiness;
    visited.push(index);

    card.classList.add("selected");

    updateStats();

    if (timeLeft <= 0) {
        finishGame();
    }
}

function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishGame();
            return;
        }

        timeLeft -= 1;
        updateStats();
    }, 60000);
}

function finishGame() {
    clearInterval(timerInterval);

    const spent = startingTime - timeLeft;

    resultCity.textContent = currentLocation.city;
    placesVisited.textContent = visited.length;
    timeSpent.textContent = formatSpentTime(spent);
    moneySpent.textContent = `€${45 - money}`;
    finalHappiness.textContent = happiness;
    memoryCity.textContent = currentLocation.code;

    if (visited.length === 0) {
        resultSubtitle.textContent = "sometimes the best travel plans are no plans at all.";
        memoryText.textContent = `you had ${formatTime(timeLeft)} left, but at least you got a little time to breathe.`;
    } else if (happiness >= 80) {
        resultSubtitle.textContent = "you definitely made the most of your layover.";
        memoryText.textContent = `a few hours in ${currentLocation.city}, and somehow it already feels like a memory.`;
    } else if (happiness >= 60) {
        resultSubtitle.textContent = "not a bad way to spend the time in between.";
        memoryText.textContent = `you squeezed a little adventure into an otherwise ordinary layover.`;
    } else {
        resultSubtitle.textContent = "it wasn't exactly the perfect day, but you went somewhere.";
        memoryText.textContent = `maybe next time you'll have a little more time in ${currentLocation.city}.`;
    }

    showScreen(resultScreen);
}

startButton.addEventListener("click", () => {
    pickLocation();
    showScreen(destinationScreen);
});

exploreButton.addEventListener("click", () => {
    showScreen(exploreScreen);
    startTimer();
});

finishButton.addEventListener("click", () => {
    finishGame();
});

againButton.addEventListener("click", () => {
    clearInterval(timerInterval);
    showScreen(startScreen);
});