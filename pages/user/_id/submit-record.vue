<template>
  <div>
    <div v-if="submitted" class="msg-submitted">{{ $t('submitted-msg') }}</div>
    <form ref="form" action="post" @submit.prevent="onSubmit()">
      <b-field :label="$t('inputLabel.selectDate')">
        <b-datepicker
          ref="datepicker"
          :value="new Date(record.date)"
          placeholder="Select a date"
          trap-focus
          :max-date="new Date()"
          :min-date="minDate"
          @input="onDateChange"
        >
        </b-datepicker>
      </b-field>
      <b-field :label="$t('inputLabel.typeOfPT')">
        <b-select
          v-model="selectedType"
          placeholder="Please Select"
          required
          @input="onTypeSelect()"
        >
          <option v-for="tab in Object.keys(tabs)" :key="tab" :value="tab">
            {{ $t(`typeOfPT.${tabs[tab]}`) }}
          </option>
        </b-select>
      </b-field>

      <!-- mtr, light_railway, airport_express -->
      <section
        v-if="
          selectedType === 'mtr_lines' ||
          selectedType === 'airport_express' ||
          selectedType === 'light_rail'
        "
        key="railway"
        :is-record-edit="isRecordEdit"
      >
        <railWay :type="selectedType" />
      </section>

      <section v-else-if="selectedType === 'ferry'" key="ferry">
        <ferry :is-record-edit="isRecordEdit" />
      </section>

      <section
        v-else-if="selectedType === 'bus' || selectedType === 'minibus'"
        key="bus"
      >
        <bus-mini-bus :is-record-edit="isRecordEdit" :type="selectedType" />
      </section>

      <ValidationProvider v-slot="{ errors }">
        <b-field :label="$t('inputLabel.fare')" class="fare">
          <b-input
            :value="record.fare"
            class="fare-input"
            @input="onFareChange"
          ></b-input>
        </b-field>
        <span>{{ errors[0] }}</span>
      </ValidationProvider>
      <div class="field check-box">
        <b-checkbox v-model="saveRoute" :disabled="savedRouteSelected">{{
          $t('inputLabel.saveRoute')
        }}</b-checkbox>
      </div>
      <div class="submit-container">
        <b-button
          type="is-primary"
          :disabled="submitDisabled"
          class="submit"
          @click="onSubmit"
        >
          <div>{{ $t('inputLabel.submit') }}</div>
        </b-button>

        <Spinner v-if="submitting" class="spinner" />
      </div>
    </form>
    <b-button id="fav-bt" @click.prevent="openScrollMenu">
      <b-icon icon="star" type="is-warning"> </b-icon>
    </b-button>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { ValidationProvider } from 'vee-validate'
import { mapState, mapActions } from 'vuex'
import localforage from 'localforage'
import RailWay from '../../../components/submit-record-parts/railway.vue'
import Ferry from '../../../components/submit-record-parts/ferry.vue'
import BusMiniBus from '../../../components/submit-record-parts/bus-mini-bus.vue'
import SavedRoutesScrollMenu from '~/components/savedRoutesScrollMenu'
import Spinner from '~/components/spinner'
import { defaultType } from '~/utils/constant'

export default {
  name: 'SubmitRecord',
  components: {
    RailWay,
    BusMiniBus,
    Ferry,
    ValidationProvider,
    Spinner,
  },
  middleware: ['auth'],

  async asyncData() {
    const tabs = await localforage.getItem('tabs')
    return { tabs }
  },

  data() {
    return {
      selectedType: defaultType,
      routeName: '',
      onboard: '',
      alight: '',
      saveRoute: false,
      selectedFavRoute: undefined,
      selectedRoute: undefined,
      isCustomFare: false,
      id: '',
      isRecordEdit: false,
      savedRouteSelected: false,
      submitting: false,
      submitDisabled: true,
    }
  },

  computed: {
    ...mapState({
      lang: (state) => state.user.lang,
      // tabs: (state) => state['submit-record'].tabs,
      record: (state) => state['submit-record'].record,
    }),
    ...mapActions({
      saveToTemp: 'records/saveToTemp',
    }),
    minDate() {
      const d = new Date()
      d.setMonth(d.getMonth() - 3)
      return d
    },
    favRoutes() {
      return this.$store.state.user.favRoutes
    },
    submitted() {
      return this.$route.query.submitted
    },
  },
  watch: {
    record: {
      handler(newVal, oldVal) {
        this.enableSavingRoute()
        if (newVal.fare) this.submitDisabled = false
      },
      deep: true,
    },
  },

  mounted() {
    // this.$store.dispatch('submit-record/getTabs')

    this.$store.dispatch('user/getFavRoutes')

    // check if it is edit route
    const id = this.$route.query.id
    if (id) {
      this.$store.dispatch('records/getRecords')
      const data = this.$store.state.records.data

      // find the record
      for (const key in data) {
        const item = data[key]
        if (item.id === id) {
          this.selectedType = item.typeOfPT
          this.$store.commit('submit-record/setRecord', { ...item })
          this.id = id

          break
        }
      }
      this.isRecordEdit = true
    }
  },
  destroyed() {
    this.$store.dispatch('submit-record/resetAllState')
  },
  methods: {
    // methods related input record
    enableSavingRoute() {
      this.savedRouteSelected = false
    },
    onDateChange(val) {
      this.$store.commit('submit-record/setRecord', { date: val })
    },
    onTypeSelect() {
      this.$store.commit('submit-record/resetRecord', this.selectedType)
      if (this.selectedType === 'tram')
        this.$store.dispatch('submit-record/getTramFare')
    },

    setRouteInfo(type) {
      const dispatch = this.$store.dispatch
      if (type === 'bus' || type === 'minibus') {
        dispatch('bus/getRouteName')
        dispatch('bus/getOnboardStops')
        dispatch('bus/getAlightStops')
        dispatch('bus/getFare')
      }
    },

    openScrollMenu() {
      this.$buefy.modal.open({
        parent: this,
        component: SavedRoutesScrollMenu,
        props: {
          favRoutes: this.favRoutes,
          onSelect: (row) => {
            const {
              alightStopId,
              fare,
              bounds,
              routeIndex,
              onboardStopId,
              typeOfPT,
            } = row
            this.$store.commit('submit-record/setRecord', {
              alightStopId,
              fare,
              bounds,
              routeIndex,
              onboardStopId,
              typeOfPT,
            })
            this.selectedType = row.typeOfPT
            this.$store.dispatch('user/savedRouteFreqIncrease', row._id)
            this.savedRouteSelected = true
            this.setRouteInfo(typeOfPT)
          },
        },
        fullScreen: true,
        customClass: 'custom-modal',
      })
    },
    onFareChange(val) {
      this.$store.commit('submit-record/setRecord', { fare: Number(val) })
    },
    async onSubmit() {
      const { record } = this
      this.submitDisabled = true
      this.submitting = true

      const arr = Object.entries(record)

      // database no routename field
      const filteedRecord = Object.fromEntries(
        arr.filter(([key, val]) => {
          return key !== 'routeName'
        })
      )

      if (this.$nuxt.isOffline) {
        return this.saveToTemp(filteedRecord)
      }

      let res
      if (this.isRecordEdit) {
        res = await this.$store.dispatch('records/editRecord', {
          ...filteedRecord,
          id: this.id,
        })
      } else {
        res = await this.$store.dispatch('records/addRecord', {
          ...filteedRecord,
        })
      }

      if (this.saveRoute) {
        const {
          alightStopId,
          onboardStopId,
          routeIndex,
          fare,
          typeOfPT,
          bounds,
        } = record
        this.$store.dispatch('user/saveFavRoute', {
          alightStopId,
          onboardStopId,
          routeIndex,
          fare,
          typeOfPT,
          bounds,
          frequency: 0, // how many time it is used
          _id: uuidv4(),
        })
      }

      if (res) {
        window.location.href =
          this.$router.currentRoute.path + '?submitted=true'
      }
    },
    onToggleCustomFare() {
      this.isCustomFare = !this.isCustomFare
    },
  },
}
</script>
<style lang="scss" scoped>
.msg-submitted {
  margin-bottom: 10px;
  color: red;
  font-style: italic;
}

.price {
  border: none;
  border-bottom: 2px solid black;
  display: inline;
}

section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.submit-container {
  display: flex;
  align-items: center;
  margin-top: 20px;

  .spinner {
    margin-left: 10px;
  }
}

.fare,
.submit {
  min-width: 82px;
}

.check-box {
  margin-top: 25px;
}

#fav-bt {
  position: fixed;
  bottom: $shortcutBtBottom;
  right: $shortcutBtRight;
  border-radius: 50%;
  -webkit-box-shadow: 0px 0px 20px 0px rgba(179, 179, 179, 0.5);
  -moz-box-shadow: 0px 0px 20px 0px rgba(179, 179, 179, 0.5);
  box-shadow: 0px 0px 20px 0px rgba(179, 179, 179, 0.5);
  border: none;
}

.custom-modal.is-full-screen > .animation-content {
  background-color: #00000010;
  z-index: 0;
}
</style>
