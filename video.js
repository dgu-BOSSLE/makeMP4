// 버튼이 눌려있는 상태인지 표시하는 전역 변수

var isButtonPressed = false;
//여기를 수정해야함. 어우 졸령...
function executeCanvasRelatedCode(canvas) {
  var videoWriter = new WebMWriter({
    quality: 0.95,
    frameRate: 15,
  });

  var duration = 10; // 10초
  var interval = 1000 / 15; // 15 FPS에 해당하는 밀리초 간격

  var captureFrames = setInterval(function () {
    // requestAnimationFrame을 사용하여 captureAndAddImage 함수 호출
    requestAnimationFrame(function () {
      videoWriter.addFrame(canvas);
    });
  }, interval);

  // 지정된 시간이 경과한 후에 캡처를 중지하고 비디오를 컴파일
  setTimeout(function () {
    clearInterval(captureFrames);

    // 동영상 작성 완료
    videoWriter.complete().then(function (webMBlob) {
      var reader = new FileReader();
      reader.onload = function () {
        window.flutter_inappwebview.callHandler("videoCreated", reader.result);
      };
      reader.readAsDataURL(webMBlob);
    });
  }, duration * 1000); // duration을 밀리초로 변환
}

// MutationObserver를 설정하여 canvas가 추가될 때마다 감지
// var observer = new MutationObserver(function (mutations) {
//   mutations.forEach(function (mutation) {
//     if (mutation.addedNodes) {
//       [].slice.call(mutation.addedNodes).forEach(function (node) {
//         if (node.nodeName.toLowerCase() === "canvas") {
//           executeCanvasRelatedCode(node);
//         }
//       });
//     }
//   });
// });

// // 전체 문서를 관찰하면서 새로운 노드(자식 요소)가 추가될 때마다 감지
// observer.observe(document.body, {
//   childList: true,
//   subtree: true,
// });

function checkForCanvasAndExecute() {
  if (isButtonPressed) {
    console.log("Button is pressed");
    var canvasElements = document.querySelectorAll("canvas");
    console.log(canvasElements);
    if (canvasElements.length > 0) {
      //이거 요소로 해도 되나? 일단 이렇게 해도 작동하긴 함.
      executeCanvasRelatedCode(canvasElements[0]);
    }
  }
  isButtonPressed = false;
}

// 1초 간격으로 checkForCanvasAndExecute 함수를 호출
setInterval(checkForCanvasAndExecute, 1000);

var canvasElements = document.querySelectorAll("canvas");
console.log("Number of canvas elements:", canvasElements.length);
