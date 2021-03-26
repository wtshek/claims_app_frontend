<template>
  <div>
    <div class="background" />
    <div v-if="!hasPhone" key="1" class="box custom-box">
      <form class="form">
        <p class="title">Login</p>
        <b-field label="Phone">
          <b-select v-model="regionCode" class="region-code" rounded>
            <option value="+852" default>+852</option>
            <option value="+86">+86</option>
          </b-select>
          <b-input
            v-model="phone"
            placeholder="e.g. 97643212"
            type="number"
            required
          >
          </b-input>
        </b-field>
        <b-button
          class="m-top primary-button"
          type="is-link"
          @click="onGenerateOTP"
        >
          Continue
        </b-button>
        <error-msg :msg="errorMsg" />
        <span class="switch" @click="onRedirect">no account yet?</span>
      </form>
    </div>
    <transition name="slide">
      <div v-if="hasPhone" key="2" class="box custom-box">
        <form class="form">
          <p class="title">Login</p>
          <b-field label="Verification Code">
            <b-input v-model="verificationCode" placeholder="" required>
            </b-input>
          </b-field>
          <div>
            <b-button
              class="m-top primary-button"
              type="is-link"
              @click="onLogin"
            >
              Verify
            </b-button>
            <error-msg :msg="errorMsg" />
            <span class="switch" @click="onResendCode">Resend Code</span>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
import { defaultLanding, signUp } from '../config/routes'
import ErrorMsg from '../components/errorMsg'

export default {
  name: 'Login',
  layout: 'box',
  components: {
    ErrorMsg,
  },
  data() {
    return {
      phone: '',
      hasPhone: false,
      verificationCode: '',
      errorMsg: '',
      regionCode: '+852',
    }
  },
  computed: {
    completePhone() {
      const phone = this.regionCode + this.phone
      return phone.trim()
    },
  },
  methods: {
    onRedirect() {
      this.$router.push(signUp.route)
    },
    onResendCode() {},
    async onGenerateOTP() {
      if (this.phone.length !== 8 || this.phone.length === 0) {
        return (this.errorMsg = 'Incorrect phone number format.')
      }
      const res = await this.$store.dispatch('user/login', {
        phone: this.completePhone,
      })
      if (res.code === 401) {
        this.errorMsg = 'User does not exist'
      } else {
        this.hasPhone = !this.hasPhone
      }
    },
    async onLogin() {
      const res = await this.$store.dispatch('user/login', {
        phone: this.completePhone,
        pwd: this.verificationCode,
      })

      if (res.code === 200) {
        this.$router.push(defaultLanding.route)
      } else {
        this.errorMsg = 'Wrong Verification Code'
      }
    },
  },
}
</script>
