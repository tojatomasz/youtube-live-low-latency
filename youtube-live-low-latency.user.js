// ==UserScript==
// @name        YouTube Live Low Latency
// @description Adjusts YouTube live stream playback speed based on latency
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       GM.getValue
// @grant       GM.setValue
// @version     1.0
// @author      tojatomasz
// @website     https://github.com/tojatomasz/youtube-live-low-latency
// @author      SilentShout42 (userscript adaptation)
// @website     https://github.com/SilentShout42/youtube-live-low-latency
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license     MIT
// @updateURL   https://raw.githubusercontent.com/SilentShout42/youtube-live-low-latency/main/youtube-live-low-latency.user.js
// @downloadURL https://raw.githubusercontent.com/SilentShout42/youtube-live-low-latency/main/youtube-live-low-latency.user.js
// @supportURL  https://github.com/SilentShout42/youtube-live-low-latency/issues
// ==/UserScript==


(async function () {
  // Default configuration values
  const defaultConfig = {
    latencyThresholdFast: 1.0,
    latencyThresholdSlow: 0.25,
    playbackRateFast: 1.1,
    playbackRateNormal: 1.0,
    playbackRateSlow: 0.75,
    intervalMs: 500,
    debugLogging: false
  };

  async function getConfigValue(key, defaultValue) {
    let value = await GM.getValue(key, defaultValue);
    if (typeof defaultValue === 'number') {
      value = parseFloat(value);
      if (isNaN(value)) {
        value = defaultValue;
      }
    }
    // Store the defaults in script values so they're visible in userscript addon settings
    if (value === defaultValue) {
      await GM.setValue(key, defaultValue);
    }
    return value;
  }

  // Load configuration
  const config = {
    latencyThresholdFast: await getConfigValue('latencyThresholdFast', defaultConfig.latencyThresholdFast),
    latencyThresholdSlow: await getConfigValue('latencyThresholdSlow', defaultConfig.latencyThresholdSlow),
    playbackRateFast: await getConfigValue('playbackRateFast', defaultConfig.playbackRateFast),
    playbackRateNormal: await getConfigValue('playbackRateNormal', defaultConfig.playbackRateNormal),
    playbackRateSlow: await getConfigValue('playbackRateSlow', defaultConfig.playbackRateSlow),
    intervalMs: await getConfigValue('intervalMs', defaultConfig.intervalMs),
    debugLogging: await getConfigValue('debugLogging', defaultConfig.debugLogging)
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

    if (config.debugLogging) {
      console.debug('[yt3l] Live Latency:', liveLatency.toFixed(2), 'seconds');
      console.debug('[yt3l] Current Playback Rate:', video.playbackRate);
    }

  }, config.intervalMs);

})();
