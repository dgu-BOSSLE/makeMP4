function executeCanvasRelatedCode(canvas) {
  var videoWriter = new WebMWriter({
    quality: 0.95,
    frameRate: 15,
  });

  var duration = 20; // 20초
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
      // 생성된 동영상 데이터를 이용해 다운로드 링크 생성
      var url = URL.createObjectURL(webMBlob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "output.webm";
      link.click();
    });
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
