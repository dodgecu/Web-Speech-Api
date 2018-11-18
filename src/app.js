/**
 *
 * Speech synthesis api
 */
const synth = window.speechSynthesis;

// Check browser support
window.SpeechRecognition =
  window.webkitSpeechRecognition || window.SpeechRecognition;

if (!("SpeechRecognition" || "speechSynthesis" in window)) {
  console.log("API not supported by your web browser");
} else {
  // Global DOM vars
  const textForm = document.querySelector("form"),
    textInput = document.querySelector("#text-input"),
    voiceSelect = document.querySelector("#voice-select"),
    rate = document.querySelector("#rate"),
    rateValue = document.querySelector("#rate-value"),
    pitch = document.querySelector("#pitch"),
    pitchValue = document.querySelector("#pitch-value"),
    speakBtn = document.querySelector(".speak-btn"),
    startRec = document.querySelector(".start-speech"),
    stopRec = document.querySelector(".stop-speech"),
    body = document.querySelector("body");

  // Init voices array
  let voices = [];
  function getVoices() {
    voices = synth.getVoices();
    voices.map(voice => {
      const option = document.createElement("option");
      option.textContent = `${voice.name
        .split(" ")
        .filter((el, i) => i !== 0)
        .join(" ")
        .replace(/^\w/, c => c.toUpperCase())} ${voice.lang}`;
      option.setAttribute("data-lang", voice.lang);
      option.setAttribute("data-name", voice.name);
      voiceSelect.appendChild(option);
    });
  }

  // Asynchronous voices array request: https://stackoverflow.com/questions/49506716/speechsynthesis-getvoices-returns-empty-array-on-windows
  getVoices();

  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
  }

  // Speak
  function speak() {
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
        body.style.background = "#000";
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
  }

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

  /**
   *
   * Speech recognition
   *
   */

  // Init recognition object
  const recognition = new window.SpeechRecognition();

  // Recognition params
  recognition.interimResults = true;
  recognition.maxAlternatives = 10;
  recognition.continuous = true;
  recognition.lang = "en-US";
  recognition.onresult = event =>
    (textInput.innerHTML = event.results[0][0].transcript);

  // Recognition event listeners

  function startRecording() {
    voiceSelect.setAttribute("disabled", "");
    textInput.setAttribute("disabled", "");
    speakBtn.setAttribute("disabled", "");
    rate.setAttribute("disabled", "");
    pitch.setAttribute("disabled", "");
    body.style.background = "#000 url(/img/rec.gif)";
    body.style.backgroundSize = "cover";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundPosition = "center";
    recognition.start();
  }
  function stopRecording() {
    textInput.removeAttribute("disabled");
    voiceSelect.removeAttribute("disabled");
    speakBtn.removeAttribute("disabled");
    rate.removeAttribute("disabled");
    pitch.removeAttribute("disabled");
    body.style.background = "#000";
    recognition.stop();
  }
  startRec.addEventListener("click", startRecording);
  stopRec.addEventListener("click", stopRecording);
}
