import 'hls.js/dist/hls.light.min.js';

const nativeHlsSupport = document.createElement('video').canPlayType('application/x-mpegURL') !== '';
const hlsJsSupport = Hls.isSupported();
const hasHlsSupport = nativeHlsSupport || hlsJsSupport;

export const HlsHelper = {nativeHlsSupport, hlsJsSupport, hasHlsSupport};
