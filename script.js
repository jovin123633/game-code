// --- GAME STATE ---
let balance = parseInt(localStorage.getItem("balance")) || 1000;
let debt = parseInt(localStorage.getItem("debt")) || 0;
let jackpot = parseInt(localStorage.getItem("jackpot")) || 5000;

let lastWin = 0;
const CREDIT_LIMIT = 3000;

// --- ELEMENTS ---
const dice = document.getElementById("dice");
const result = document.getElementById("result");
const dealer = document.getElementById("dealer");
const balanceText = document.getElementById("balance");
const debtText = document.getElementById("debt");
const jackpotText = document.getElementById("jackpot");

const betInput = document.getElementById("betAmount");
const chosenNumber = document.getElementById("chosenNumber");

// --- BUTTON EVENTS ---
document.getElementById("rollBtn").onclick = rollDice;
document.getElementById("doubleBtn").onclick = doubleOrNothing;
document.getElementById("loanBtn").onclick = getCredit;
document.getElementById("payBtn").onclick = payDebt;

// --- SOUNDS ---
const diceRollSound = new Audio("C:\Users\Roldan\Downloads\Roll of dice.mp3");
const winSound = new Audio("sounds/win.mp3");
const loseSound = new Audio("sounds/lose.mp3");
const jackpotSound = new Audio("sounds/jackpot.mp3");

// --- INITIAL UI ---
updateUI();
speak("Welcome to the table!");

// --- FUNCTIONS ---

function rollDice() {
    let bet = parseInt(betInput.value);
    let choice = chosenNumber.value;

    if (!bet || bet <= 0 || bet > balance) {
        speak("Careful… that bet makes no sense.");
        return;
    }

    if (!choice) {
        speak("Pick a number, my friend.");
        return;
    }

    // Play dice roll sound
    diceRollSound.currentTime = 0;
    diceRollSound.play();


    dice.classList.add("rolling");
    speak("Rolling the dice…");

    let anim = setInterval(() => {
        dice.textContent = Math.floor(Math.random() * 6) + 1;
    }, 100);

    setTimeout(() => {
        clearInterval(anim);
        dice.classList.remove("rolling");

        let roll = Math.floor(Math.random() * 6) + 1;
        dice.textContent = roll;

        jackpot += Math.floor(bet * 0.1);

        if (roll == choice) {
            lastWin = bet * 5;
            balance += lastWin;
            speak("Luck is smiling on you!");
            result.textContent = `🎉 WIN ₱${lastWin}`;
            winSound.play();

            // Jackpot chance
            if (Math.random() < 0.05) {
                balance += jackpot;
                speak("JACKPOT! The house bleeds tonight.");
                result.textContent += ` 💥 JACKPOT ₱${jackpot}`;
                jackpotSound.play();
                jackpot = 5000;
            }
        } else {
            balance -= bet;
            lastWin = 0;
            speak("The house always waits.");
            result.textContent = `💀 LOST ₱${bet}`;
            loseSound.play();
        }

        save();
        updateUI();
    }, 2000);
}

function doubleOrNothing() {
    if (lastWin <= 0) {
        speak("You need winnings first.");
        return;
    }

    if (Math.random() < 0.5) {
        balance += lastWin;
        lastWin *= 2;
        speak("Bold move… and it worked.");
        result.textContent = `🔥 DOUBLE ₱${lastWin}`;
        winSound.play();
    } else {
        balance -= lastWin;
        lastWin = 0;
        speak("Greed punished.");
        result.textContent = "💥 LOST EVERYTHING";
        loseSound.play();
    }

    save();
    updateUI();
}

function getCredit() {
    if (debt >= CREDIT_LIMIT) {
        speak("No more credit. Pay your debt.");
        return;
    }

    let loan = 500;
    balance += loan;
    debt += loan;
    speak("Credit granted. Don’t forget who you owe.");

    save();
    updateUI();
}

function payDebt() {
    if (debt <= 0) {
        speak("You owe nothing.");
        return;
    }

    if (balance < debt) {
        speak("You don’t have enough to pay.");
        return;
    }

    balance -= debt;
    speak("Debt cleared. Good.");
    debt = 0;

    save();
    updateUI();
}

function speak(message) {
    dealer.textContent = "🤵 Dealer: " + message;
}

function updateUI() {
    balanceText.textContent = balance;
    debtText.textContent = debt;
    jackpotText.textContent = jackpot;
}

function save() {
    localStorage.setItem("balance", balance);
    localStorage.setItem("debt", debt);
    localStorage.setItem("jackpot", jackpot);
}
