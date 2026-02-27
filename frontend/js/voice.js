// voice.js — Web Speech API wrapper with fallback

const Voice = (() => {
  let recognition = null;
  let isListening = false;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  function isSupported() {
    return !!SpeechRecognition;
  }

  function init(onResult, onError, onStart, onEnd) {
    if (!isSupported()) return;

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => { isListening = true; onStart && onStart(); };
    recognition.onend   = () => { isListening = false; onEnd && onEnd(); };

    recognition.onresult = (event) => {
      let interim = "", final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += text;
        else interim += text;
      }
      onResult && onResult(final || interim, !!final);
    };

    recognition.onerror = (event) => {
      isListening = false;
      onError && onError(event.error);
    };
  }

  function start(lang) {
    if (!recognition) return;
    try {
      recognition.lang = lang || "en-US";
      recognition.start();
    } catch (e) { /* already started */ }
  }

  function stop() {
    if (recognition && isListening) recognition.stop();
  }

  function speak(text, lang) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang || "en-US";
    utter.rate = 0.92;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }

  return { init, start, stop, speak, isSupported };
})();
