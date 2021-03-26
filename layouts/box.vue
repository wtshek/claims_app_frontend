<template>
  <div class="center-container">
    <nuxt />
  </div>
</template>

<style lang="scss">
.center-container {
  position: relative;
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .background {
    background: $primary;
    position: fixed;
    background: $primary;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: -1111;
  }
  .custom-box {
    max-width: $box-max-width;
    position: relative;
  }

  .switch {
    cursor: pointer;
    font-size: 0.8rem;
    text-decoration: underline;
    color: #167df0;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .title {
    color: $primary;
  }

  .switch,
  a {
    cursor: pointer;
    font-size: 0.8rem;
    text-decoration: underline;
    vertical-align: bottom;
    color: #167df0;
  }

  .m-top {
    margin-top: 20px;
  }

  .m-top {
    margin-top: 20px;
  }

  .button.primary-button,
  .button.primary-button:hover {
    background-color: $primary;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .slide-leave-active,
  .slide-enter-active {
    transition: 0.3s;
  }
  .slide-enter {
    transform: translate(-200%, 0);
  }
  .slide-leave-to {
    transform: translate(-200%, 0);
  }
  .region-code {
    display: inline;

    * select {
      padding-right: 2rem;
    }
  }
}
</style>
