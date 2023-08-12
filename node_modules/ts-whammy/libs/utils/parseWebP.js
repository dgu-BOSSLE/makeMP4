"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseWebP(riff) {
    var VP8 = riff.RIFF[0].WEBP[0];
    // A VP8 keyframe starts with the 0x9d012a header
    var frameStart = VP8.indexOf('\x9d\x01\x2a');
    var c = [];
    for (var i = 0; i < 4; i++) {
        c[i] = VP8.charCodeAt(frameStart + 3 + i);
    }
    // the code below is literally copied verbatim from the bit stream spec
    var tmp = (c[1] << 8) | c[0];
    var width = tmp & 0x3FFF;
    // const horizontal_scale = tmp >> 14;
    tmp = (c[3] << 8) | c[2];
    var height = tmp & 0x3FFF;
    // const vertical_scale = tmp >> 14;
    return {
        width: width,
        height: height,
        data: VP8,
        riff: riff,
    };
}
exports.default = parseWebP;
