function checkCanvasRendered(canvas, callback) {
  var context = canvas.getContext("2d");
  var data = context.getImageData(0, 0, canvas.width, canvas.height).data;

  // 색깔 diversity를 확인하기 위한 객체
  var colors = {};

  for (var i = 0; i < data.length; i += 4) {
    // 각 픽셀의 RGB 값을 키로 사용하여 colors 객체에 저장
    var colorKey = `${data[i]}-${data[i + 1]}-${data[i + 2]}`;
    colors[colorKey] = (colors[colorKey] || 0) + 1;
  }

  // 여러 색깔의 픽셀이 존재하는지 확인
  // 예: 색상이 3개 이상인 경우 렌더링 완료로 간주
  if (Object.keys(colors).length > 3) {
    callback();
    return;
  }

  // 아직 원하는 조건에 맞게 렌더링이 완료되지 않았다면 다시 확인
  requestAnimationFrame(() => checkCanvasRendered(canvas, callback));
}

// Canvas 관련 코드를 실행하는 함수
function executeCanvasRelatedCode(canvas) {
  // 캔버스가 정상적으로 참조되었는지 확인합니다.
  console.log(canvas);

  var video = new Whammy.Video(15); // 15는 FPS (frames per second)입니다.

  // 주어진 시간 동안(예: 10초), 일정 간격으로(예: 100밀리초) 캔버스를 캡처합니다.
  var duration = 10; // 10초
  var interval = 100; // 100밀리초 간격

  var captureFrames = setInterval(function () {
    // 캔버스를 이미지 데이터로 변환합니다.
    var dataURL = canvas.toDataURL("image/webp");

    // 이미지 데이터를 Whammy Video 객체에 추가합니다.
    video.add(dataURL);
  }, interval);

  // 지정된 시간이 경과한 후에 캡처를 중지하고 비디오를 컴파일합니다.
  setTimeout(function () {
    clearInterval(captureFrames);

    // 동영상 데이터를 생성합니다.
    var output = video.compile();

    // 생성된 동영상 데이터를 이용해 다운로드 링크를 만듭니다.
    var url = URL.createObjectURL(output);
    var link = document.createElement("a");
    link.href = url;
    link.download = "output.webm";
    link.click();
  }, duration * 1000); // duration을 밀리초로 변환합니다.
}

// MutationObserver를 설정하여 canvas가 추가될 때마다 감지합니다.
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

// 전체 문서를 관찰하면서 새로운 노드(자식 요소)가 추가될 때마다 감지합니다.
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
