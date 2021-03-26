<template>
  <div>
    <div class="background" />
    <div v-if="!enteredInfo" key="1" class="box custom-box">
      <form class="form">
        <p class="title">Sign Up</p>
        <b-field label="Phone">
          <b-select v-model="regionCode" class="region-code" rounded>
            <option value="+852" default>+852</option>
            <option value="+86">+86</option>
          </b-select>
          <b-input
            v-model="phone"
            class="phone"
            placeholder="e.g. 97643212"
            type="number"
            required
          >
          </b-input>
        </b-field>
        <b-field label="Name">
          <b-input v-model="lastName" placeholder="Last Name" required>
          </b-input>
          <b-input
            v-model="firstName"
            class="first-name"
            placeholder="First Name"
            required
          >
          </b-input>
        </b-field>
        <b-button class="m-top primary-button" type="is-link" @click="nextPage">
          Continue
        </b-button>
        <error-msg :msg="errorMsg" />
        <span class="switch" @click="onRedirect">already have account?</span>
      </form>
    </div>

    <transition name="slide">
      <div v-if="enteredInfo" key="2" class="box custom-box">
        <form class="form">
          <p class="title">Sign Up</p>
          <b-field label="Verification Code">
            <b-input v-model="verificationCode" placeholder=""> </b-input>
          </b-field>
          <div>
            <b-button
              class="m-top primary-button"
              type="is-link"
              @click="onSignUp"
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
// import SignUpLogin from '../components/signUpLogIn'
import { defaultLanding, login } from '../config/routes'

export default {
  name: 'SignUp',
  layout: 'box',
  data() {
    return {
      firstName: '',
      lastName: '',
      regionCode: '+852',
      enteredInfo: false,
      errorMsg: '',
      phone: '',
      verificationCode: '',
    }
  },
  computed: {
    completePhone() {
      const phone = this.regionCode + this.phone
      return phone.trim()
    },
  },

  methods: {
    signIn(info) {
      this.$store.commit('user/sign-up', info).then(() => {
        this.$router.push('/user/:id')
      })
    },

    async nextPage() {
      if (
        this.phone.length === 0 ||
        this.firstName.length === 0 ||
        this.lastName.length === 0
      ) {
        this.errorMsg = 'Info is incomplete'
      } else if (this.phone.length !== 8) {
        this.errorMsg = 'Incorrect phone number format.'
      } else {
        const res = await this.$store.dispatch('user/signUp', {
          phone: this.completePhone,
          firstName: this.firstName,
          lastName: this.lastName,
        })
        if (res.code !== 200)
          return (this.errorMsg = 'User with this phone number already exists.')
        this.errorMsg = ''
        this.enteredInfo = true
      }
    },
    onRedirect() {
      this.$router.push(login.route)
    },
    onResendCode() {},
    async onSignUp() {
      const res = await this.$store.dispatch('user/signUp', {
        phone: this.completePhone,
        firstName: this.firstName,
        lastName: this.lastName,
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
<style lang="scss" scoped>
.phone {
  width: 100%;
}
.first-name {
  margin-left: 10px;
}
</style>
