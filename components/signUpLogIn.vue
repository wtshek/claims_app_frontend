<template>
  <div>
    <div class="background" />
    <div v-if="!hasPhone" key="1" class="box custom-box">
      <form class="form">
        <p class="title">{{ formText }}</p>
        <b-field label="Phone">
          <b-input v-model="phone" placeholder="e.g. 97643212"> </b-input>
        </b-field>
        <b-button
          class="m-top primary-button"
          type="is-link"
          @click="onToggleHasPhone"
        >
          Continue
        </b-button>
        <span class="switch" @click="onRedirect">{{ switchFuncText }}</span>
      </form>
    </div>
    <transition name="slide">
      <div v-if="hasPhone" key="2" class="box custom-box">
        <form class="form">
          <p class="title">{{ formText }}</p>
          <b-field label="Verification Code">
            <b-input v-model="verificationCode" placeholder=""> </b-input>
          </b-field>
          <div>
            <b-button
              class="m-top primary-button"
              type="is-link"
              @click="onFinish"
            >
              Verify
            </b-button>
            <span class="switch" @click="onResendCode">Resend Code</span>
            <span class="switch" @click="onToggleHasPhone">Cancel</span>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
// TODO: handle enter key value
import { signUp, login } from '../config/routes'
export default {
  name: 'SignUpLogin',
  layout: 'center',
  props: {
    onSubmit: {
      type: Function,
      default: () => {},
    },
    formFunction: {
      type: String,
      default: 'sign-up',
    },
    onResendCode: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      phone: '',
      hasPhone: false,
      verificationCode: '',
    }
  },
  computed: {
    formText() {
      return this.formFunction === 'sign-up' ? 'Sign Up' : 'Login'
    },

    switchFuncText() {
      return this.formFunction === 'sign-up'
        ? 'already have account?'
        : 'no account yet?'
    },
  },

  methods: {
    onBtClick() {
      this.callback({ phone: this.phone })
    },
    onRedirect() {
      if (this.formFunction === 'sign-up') {
        this.$router.push(login.route)
      } else {
        this.$router.push(signUp.route)
      }
    },
    onToggleHasPhone() {
      this.onSubmit({ phone: this.phone })
      this.hasPhone = !this.hasPhone
    },
    onFinish() {
      this.onSubmit({ phone: this.phone, pwd: this.verificationCode })
    },
  },
}
</script>

<style lang="scss" scoped>
.background {
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
</style>
