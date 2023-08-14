// 웹 브라우저에서 화면 녹화를 수행하고 녹화된 동영상의 URL을 생성하는 기능을 제공
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const output = document.getElementById("output");

let mediaRecorder;
let chunks = [];

startButton.onclick = async function () {
  const displayMediaOptions = {
    video: {
      cursor: "always",
    },
    audio: false,
  };

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.start();

    startButton.disabled = true;
    stopButton.disabled = false;
  } catch (err) {
    console.error("Error: " + err);
  }
};

stopButton.onclick = function () {
  mediaRecorder.stop();

  mediaRecorder.onstop = function () {
    const blob = new Blob(chunks, { type: "video/webm" });
    chunks = [];

    const videoURL = URL.createObjectURL(blob);
    output.textContent = "Video URL: " + videoURL;

    startButton.disabled = false;
    stopButton.disabled = true;
  };
};
