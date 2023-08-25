let worker = new Worker('node_modules/ffmpeg.js/ffmpeg-worker-mp4.js');

worker.onmessage = function (event) {
    let message = event.data;
    switch (message.type) {
        case 'ready':
            console.log('Worker ready');
            break;
        case 'stdout':
            console.log(message.data);
            break;
        case 'stderr':
            console.log(message.data);
            break;
        case 'done':
            if (message.data) {
                let result = message.data.MEMFS[0];
                let blob = new Blob([result.data]);
                let url = URL.createObjectURL(blob);
                document.getElementById('downloadLink').href = url;
                document.getElementById('downloadLink').download =
                    'converted.mp4';
                document.getElementById('downloadLink').style.display = 'block';
            } else {
                // 오류 처리...\
                console.log('Error');
            }

            break;
    }
};

function convertToMP4() {
    let inputFile = document.getElementById('inputFile').files[0];
    if (!inputFile) {
        alert('Please upload a WebM file.');
        return;
    }

    let reader = new FileReader();
    reader.onload = function (event) {
        let data = new Uint8Array(event.target.result);
        worker.postMessage({
            type: 'run',
            MEMFS: [{ name: 'input.webm', data: data }],
            arguments: [
                '-i',
                'input.webm',
                '-vf',
                'scale=-2:670',
                '-c:v',
                'libx264',
                '-preset',
                'ultrafast', // 인코딩 속도를 빠르게 설정 (품질 저하 가능)
                '-b:v',
                '500k',
                'output.mp4',
            ],
        });
    };
    reader.readAsArrayBuffer(inputFile);
}
