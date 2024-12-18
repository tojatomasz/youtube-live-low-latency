// Use it in the Developer Console in the same tab where YouTube Live is located
// Configuration parameters
const config = {
    latencyThresholdFast: 1.0,        // Latency > latencyThresholdFast -> speed up (adjust as needed, you can go lower if the connection is stable)
    latencyThresholdSlow: 0.25,     // Latency < latencyThresholdSlow -> slow down (adjust as needed, you can go lower if the connection is stable)
    playbackRateFast: 1.1,         // Speed when fast
    playbackRateNormal: 1.0,       // Normal playback speed
    playbackRateSlow: 0.75,        // Speed when slow
    intervalMs: 500                // Refresh interval in ms
};

// Start interval
const intervalId = setInterval(() => {
    const video = document.querySelector('video');
    if (!video) return;

    // Calculate Live Latency
    const liveLatency = video.buffered.end(0) - video.currentTime;

    // Adjust playback speed based on latency
    if (liveLatency > config.latencyThresholdFast) {
        video.playbackRate = config.playbackRateFast; // Speed up
    } else if (liveLatency <= config.latencyThresholdSlow) {
        video.playbackRate = config.playbackRateSlow; // Slow down
    } else {
        video.playbackRate = config.playbackRateNormal; // Normal speed
    }

    // Debug output (optional)
    console.clear();
    console.log('Live Latency:', liveLatency.toFixed(2), 'seconds');
    console.log('Current Playback Rate:', video.playbackRate);

}, config.intervalMs);

// Stop interval (when needed)
// clearInterval(intervalId);
