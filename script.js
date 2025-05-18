const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const strengthScore = document.getElementById("strengthScore");
const tipsBox = document.getElementById("tips");

const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const showPasswordBtn = document.getElementById("showPasswordBtn");

let isPasswordVisible = false;

function analyzePassword(password) {
  let score = 0;
  let suggestions = [];

  if (password.length >= 12) {
    score += 25;
  } else if (password.length >= 8) {
    score += 15;
    suggestions.push("Use at least 12 characters");
  } else {
    suggestions.push("Password is too short (min 8 characters)");
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 15;
  } else {
    suggestions.push("Mix uppercase and lowercase letters");
  }

  if (/\d/.test(password)) {
    score += 15;
  } else {
    suggestions.push("Add numbers (0–9)");
  }

  if (/[!@#$%^&*(),.?":{}<>]/.test(password)) {
    score += 20;
  } else {
    suggestions.push("Add special symbols (!@#...)");
  }

  if (!/(.)\1{2,}/.test(password)) {
    score += 10;
  } else {
    suggestions.push("Avoid repeating characters (like aaa or 111)");
  }

  const commonPasswords = ["123456", "password", "123456789", "qwerty", "letmein"];
  if (commonPasswords.includes(password.toLowerCase())) {
    score = 0;
    suggestions = ["This password is way too common — avoid it at all costs!"];
  }

  if (score > 100) score = 100;
  return { score, suggestions };
}

function updateStrengthMeter(password) {
  const { score, suggestions } = analyzePassword(password);
  strengthBar.style.width = `${score}%`;

  if (score < 40) {
    strengthBar.style.backgroundColor = "red";
    strengthText.textContent = "Weak";
  } else if (score < 70) {
    strengthBar.style.backgroundColor = "orange";
    strengthText.textContent = "Medium";
  } else {
    strengthBar.style.backgroundColor = "green";
    strengthText.textContent = "Strong!";
  }

  strengthScore.textContent = `Score: ${score}/100`;

  tipsBox.innerHTML = "";
  suggestions.forEach(tip => {
    const li = document.createElement("li");
    li.textContent = tip;
    tipsBox.appendChild(li);
  });
}

if (passwordInput) {
  passwordInput.addEventListener("input", () => {
    updateStrengthMeter(passwordInput.value);
  });
}

if (lengthSlider && lengthValue) {
  lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
  });
}

function generatePassword(length, includeSymbols, includeUppercase) {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+{}[]<>?/.,";
  
  let allChars = lowercase + numbers;
  if (includeUppercase) allChars += uppercase;
  if (includeSymbols) allChars += symbols;

  let password = "";
  for (let i = 0; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  return password;
}

if (generateBtn) {
  generateBtn.addEventListener("click", () => {
    const length = parseInt(lengthSlider.value);
    const includeSymbols = document.getElementById("includeSymbols").checked;
    const includeUppercase = document.getElementById("includeUppercase").checked;

    const newPassword = generatePassword(length, includeSymbols, includeUppercase);
    passwordInput.value = newPassword;
    updateStrengthMeter(newPassword);
  });
}

if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(passwordInput.value).then(() => {
      alert("Password copied to clipboard!");
    }).catch(err => {
      alert("Failed to copy: " + err);
    });
  });
}

if (showPasswordBtn) {
  showPasswordBtn.addEventListener("click", () => {
    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? "text" : "password";
    showPasswordBtn.textContent = isPasswordVisible ? "Hide" : "Show";
  });
}

