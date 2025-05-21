import { KokoroTTS } from 'kokoro-js';

const status = document.getElementById('status');
const voiceSelect = document.getElementById('voice');
const textInput = document.getElementById('text');
const speakBtn = document.getElementById('speak');

async function init() {
  status.textContent = 'Loading model...';
  const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
    dtype: 'q8',
    device: 'wasm'
  });
  status.textContent = 'Ready';

  for (const [id, info] of Object.entries(tts.voices)) {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = `${info.name} (${info.gender})`;
    voiceSelect.appendChild(opt);
  }

  speakBtn.addEventListener('click', async () => {
    speakBtn.disabled = true;
    status.textContent = 'Generating...';
    const audio = await tts.generate(textInput.value, { voice: voiceSelect.value });
    const url = URL.createObjectURL(audio.toBlob());
    const audioElem = new Audio(url);
    audioElem.addEventListener('ended', () => {
      speakBtn.disabled = false;
      status.textContent = 'Ready';
    });
    status.textContent = 'Playing...';
    audioElem.play();
  });
}

init();
