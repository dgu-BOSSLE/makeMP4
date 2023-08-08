function checkCanvasRendered(canvas, callback) {
  var context = canvas.getContext("2d");
  var data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  for (var i = 0; i < data.length; i += 4) {
    if (data[i + 3] !== 0) {
      callback();
      return;
    }
  }

  requestAnimationFrame(() => checkCanvasRendered(canvas, callback));
}
// 캔버스의 상태를 캡처하고 이미지 데이터를 Whammy.Video 객체에 추가하는 함수
function captureAndAddImage(canvas, video) {
  // 캔버스를 이미지 데이터로 변환
  var dataURL = canvas.toDataURL("image/webp");
  var img = document.createElement("img");
  img.src = dataURL;
  img.alt = "Description of the image"; // add this line
  img.title = "Additional information when hover"; // add this line
  document.body.appendChild(img);

  // 이미지 데이터를 Whammy Video 객체에 추가
  video.add(canvas);
}

function executeCanvasRelatedCode(canvas) {
  var video = new Whammy.Video(15); // 15는 FPS (frames per second)

  // 주어진 시간 동안(예: 10초), 일정 간격으로(예: 100밀리초) 캔버스를 캡처
  var duration = 10; // 10초
  var interval = 100; // 100밀리초 간격

  var captureFrames = setInterval(function () {
    // requestAnimationFrame을 사용하여 captureAndAddImage 함수 호출
    requestAnimationFrame(function () {
      captureAndAddImage(canvas, video);
    });
  }, interval);

  // 지정된 시간이 경과한 후에 캡처를 중지하고 비디오를 컴파일
  setTimeout(function () {
    clearInterval(captureFrames);

    // 동영상 데이터를 생성
    var output = video.compile();

    // 생성된 동영상 데이터를 이용해 다운로드 링크 생성
    var url = URL.createObjectURL(output);
    var link = document.createElement("a");
    link.href = url;
    link.download = "output.webm";
    link.click();
  }, duration * 1000); // duration을 밀리초로 변환
}

// MutationObserver를 설정하여 canvas가 추가될 때마다 감지
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes) {
      [].slice.call(mutation.addedNodes).forEach(function (node) {
        if (node.nodeName.toLowerCase() === "canvas") {
          executeCanvasRelatedCode(node);
        }
      });
    }
  });
});

// 전체 문서를 관찰하면서 새로운 노드(자식 요소)가 추가될 때마다 감지
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
