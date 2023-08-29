let snowflakesCount = 300;
let fallSpeedMultiplier = 1.0;

function randomInt(value = 100) {
  return Math.floor(Math.random() * value) + 1;
}

function randomIntRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

if (typeof module !== 'undefined') {
    module.exports = {
        createSnow,
        setSnowDensity,
        setSnowFallSpeed,
    };
}