// Initialize Speech API
const synth = window.speechSynthesis;

// Load DOM Elements
const textForm = document.querySelector("form"),
  textInput = document.querySelector("#text-input"),
  voiceSelect = document.querySelector("#voice-select"),
  rate = document.querySelector("#rate"),
  rateValue = document.querySelector("#rate-value"),
  pitch = document.querySelector("#pitch"),
  pitchValue = document.querySelector("#pitch-value"),
  body = document.querySelector("body");

// Init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();
  voices.map(voice => {
    const option = document.createElement("option");
    option.textContent = `${voice.name} ( ${voice.lang})`;
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    voiceSelect.appendChild(option);
  });
};

getVoices();

if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
  if (synth.speaking) {
    console.error("Speaking...");
    return;
  }
  if (textInput.value !== "") {
    // Get Speech from text area
    body.style.background = "#141414 url(/img/wave.gif)";
    body.style.backgroundSize = "contain";
    body.style.backgroundRepeat = "no-repeat";
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // Event once speech has been completed
    speakText.onend = e => {
      body.style.background = "#141414";
      console.log("Done...");
    };

    // Event in case of error
    speakText.onerror = e => {
      console.error("Something went wrong...");
    };

    // Voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );
    // Get selected voice speaking
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Pitch and Rate

    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    synth.speak(speakText);
  }
};

// Event Listeners
textForm.addEventListener("submit", e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Rate change
rate.addEventListener("change", e => (rateValue.textContent = rate.value));

// Pitch change
pitch.addEventListener("change", e => (pitchValue.textContent = pitch.value));

// Voice Select change
voiceSelect.addEventListener("change", e => speak());
