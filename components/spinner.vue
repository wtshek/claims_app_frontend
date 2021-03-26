<template>
  <svg class="spinner" viewBox="0 0 50 50">
    <circle
      class="path"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke-width="5"
    ></circle>
  </svg>
</template>
<style lang="scss" scoped>
.spinner {
  -webkit-animation: rotate-data-v-cf6853e4 2s linear infinite;
  animation: rotate-data-v-cf6853e4 2s linear infinite;
  z-index: 2;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 35px;
  margin: 6px 0 0 0;

  & .path {
    stroke: $primary;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
