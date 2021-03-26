<template>
  <div>
    <ValidationProvider v-slot="{ errors }">
      <b-field :label="$t('inputLabel.route')">
        <b-autocomplete
          v-model="computedRouteName"
          :data="
            filterAutoComplete(routeNames, computedRouteName, sortWithBusNumber)
          "
          :clearable="true"
          required
          field="name"
          :open-on-focus="true"
          @select="(option) => onRouteNameSelect(option)"
        >
          <template slot="empty">No results found</template>
        </b-autocomplete>
      </b-field>
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
    <div v-if="needToSelectStops">
      <ValidationProvider v-slot="{ errors }">
        <b-field :label="$t('inputLabel.boarding')">
          <b-select
            v-model="computedOnboard"
            required
            field="name"
            @input="(option) => onOnboardStopSelect(option)"
          >
            <option v-for="stop in onboardStops" :key="stop.id" :value="stop">
              {{ stop.name }}
            </option>
          </b-select>
        </b-field>
        <span>{{ errors[0] }}</span>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors }">
        <b-field :label="$t('inputLabel.alighting')">
          <b-select
            v-model="computedAlight"
            required
            field="name"
            @input="(option) => onAbortStopSelect(option)"
          >
            <option v-for="stop in alightStops" :key="stop.id" :value="stop">
              {{ stop.name }}
            </option>
          </b-select>
        </b-field>
        <span>{{ errors[0] }}</span>
      </ValidationProvider>
    </div>
  </div>
</template>
<script>
import { ValidationProvider } from 'vee-validate'
import { mapState } from 'vuex'
import { filterAutoComplete, sortWithBusNumber } from '../../utils/sumbitRecord'
export default {
  name: 'BusMiniBus',
  components: { ValidationProvider },
  props: {
    isRecordEdit: Boolean,
    type: String,
  },
  data() {
    return {
      routeName: '',
      sortWithBusNumber,
      onboardStop: '',
      alightStop: '',
    }
  },

  computed: {
    ...mapState({
      bus: (state) => state.bus,
      record: (state) => state.pt.record,
      submitRecord: (state) => state['submit-record'],
      PTData: (state) => state.db.PTData,
      lang: (state) => state.user.lang,
    }),
    routeNames() {
      const routeNames = this.bus.routeNames

      if (!routeNames) return []
      return Array.from(this.bus.routeNames)
    },
    computedRouteName: {
      set(val) {
        // if (this.bus.routeName !== val)
        if (val === '') return
        this.$store.commit('bus/setRouteName', val)
      },
      get() {
        return this.bus.routeName
      },
    },
    computedAlight: {
      set(val) {
        return ''
      },
      get() {
        const { alightStopId, fare } = this.submitRecord.record
        const { stops } = this.PTData

        if (stops && this.lang && alightStopId) {
          const stop = stops[alightStopId]
          const name = stop.locales[this.lang].name + ` ($${fare})`
          return { ...stop, name }
        } else {
          return {}
        }
      },
    },
    computedOnboard: {
      set(val) {
        return ''
      },
      get() {
        const { onboardStopId, routeIndex, bounds } = this.submitRecord.record
        const { stops, routes } = this.PTData

        if (stops && this.lang && onboardStopId) {
          const stop = stops[onboardStopId]
          const chart = Object.values(routes[routeIndex].charts)[0].bounds[
            bounds
          ]
          const key = Object.keys(chart).find((i) => i.includes(onboardStopId))
          const fare = Object.values(chart[key]).slice(-1)[0]
          const name = stop.locales[this.lang].name + ` ($${fare})`
          return { ...stop, name }
        } else {
          return {}
        }
      },
    },
    needToSelectStops() {
      if (this.alightStops.length <= 1 && this.onboardStops.length <= 1)
        return false
      return true
    },
    alightStops() {
      const stops = this.bus.alightStops
      if (stops.length === 1) {
        this.$store.commit('submit-record/setRecord', {
          alightStopId: stops[0].key,
        })
        this.$store.dispatch('bus/getFare')
      }
      return this.bus.alightStops || []
    },
    onboardStops() {
      return this.bus.onboardStops || []
    },
  },
  watch: {
    type() {
      this.$store.dispatch('bus/onCreated', this.type)
      this.$store.commit('bus/resetState')

      // if type change
      this.computedRouteName = ''
    },
    isRecordEdit(newVal) {
      if (newVal === true) {
        this.$store.dispatch('bus/getRouteName')
        this.$store.dispatch('bus/getOnboardStops')
        this.$store.dispatch('bus/getAlightStops')
      }
    },
  },
  mounted() {
    // this.$store.dispatch('bus/resetRoute')
    // get route name and lang
    this.$store.dispatch('bus/onCreated', this.type)
  },
  methods: {
    onRouteNameSelect(option) {
      // deal with bus, ferry and minibus only
      this.$store.commit('submit-record/resetRecord')
      this.$store.commit('bus/resetState')

      if (option !== null) {
        // get all the info about the selected route
        // get the onboard stops
        const { key, inbound } = option
        this.$store.commit('submit-record/setRecord', {
          routeIndex: Number(key),
          bounds: inbound ? 'inbound' : 'outbound',
        })
        this.$store.dispatch('bus/getRouteName')
        this.$store.dispatch('bus/getOnboardStops')
      }
    },
    filterAutoComplete,
    onOnboardStopSelect(val) {
      if (!val) return
      this.$store.commit('submit-record/setRecord', {
        onboardStopId: val.key,
      })
      this.$store.dispatch('bus/getAlightStops')
      this.$store.dispatch('bus/getFare')
    },
    onAbortStopSelect(val) {
      if (!val) return
      this.$store.commit('submit-record/setRecord', {
        alightStopId: val.key,
      })
      this.$store.dispatch('bus/getFare')
    },
  },
}
</script>
