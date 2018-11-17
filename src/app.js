// Initialize Speech API
const synth = window.speechSynthesis;

// Load DOM Elements
const textForm = document.querySelector("form"),
  textInput = document.querySelector("#text-input"),
  voiceSelect = document.querySelector("#voice-select"),
  rate = document.querySelector("#rate"),
  rateValue = document.querySelector("#rate-value"),
  pitch = document.querySelector("#pitch"),
  pitchValue = document.querySelector("#pitch-value");

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
