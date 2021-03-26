<template>
  <div>
    <ValidationProvider v-slot="{ errors }">
      <b-field :label="$t('inputLabel.boarding')">
        <b-autocomplete
          v-model="computedOnboard"
          :data="filterAutoComplete(stops, onboard, chineseSort)"
          :clearable="true"
          required
          field="name"
          :open-on-focus="true"
          @select="(option) => onOnboardStopSelect(option)"
        >
          <template slot="empty">No results found</template>
        </b-autocomplete>
      </b-field>
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
    <ValidationProvider v-slot="{ errors }">
      <b-field :label="$t('inputLabel.alighting')">
        <b-autocomplete
          v-model="computedAlight"
          field="name"
          :data="alightStopsFilter(stops, alight)"
          :clearable="true"
          required
          :open-on-focus="true"
          @select="(option) => onAlightStopSelect(option)"
        >
          <template slot="empty">No results found</template>
        </b-autocomplete>
      </b-field>
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
  </div>
</template>
<script>
import { ValidationProvider } from 'vee-validate'
import { filterAutoComplete, chineseSort } from '../../utils/sumbitRecord'
export default {
  name: 'RailWay',
  components: { ValidationProvider },
  props: { type: String, isRecordEdit: Boolean },
  data() {
    return {
      onboard: '',
      alight: '',
    }
  },
  computed: {
    stops() {
      return this.$store.state.railways.stops
    },
    computedAlight: {
      set(val) {
        this.alight = val
      },
      get() {
        const { alightStopId } = this.$store.state['submit-record'].record
        const { stops } = this.$store.state.db.PTData
        const { lang } = this.$store.state.user
        if (stops && lang && alightStopId) {
          const alightStop = JSON.parse(JSON.stringify(stops[alightStopId]))
          return (alightStop.name = alightStop.locales[lang].name)
        } else {
          return ''
        }
      },
    },
    computedOnboard: {
      set(val) {
        this.onboard = val
      },
      get() {
        const { onboardStopId } = this.$store.state['submit-record'].record
        const { stops } = this.$store.state.db.PTData
        const { lang } = this.$store.state.user
        if (stops && lang && onboardStopId) {
          const onboardStop = JSON.parse(JSON.stringify(stops[onboardStopId]))
          return onboardStop.locales[lang].name
        } else {
          return ''
        }
      },
    },
  },
  watch: {
    type() {
      this.$store.dispatch('railways/getStops', this.type)
    },
  },
  mounted() {
    this.$store.dispatch('railways/getStops', this.type)
  },
  methods: {
    filterAutoComplete,
    chineseSort,
    alightStopsFilter(stops, alight) {
      const filtered = filterAutoComplete(stops, alight, chineseSort)
      return filtered.filter((stop) => stop.name !== this.onboard)
    },
    onOnboardStopSelect(option) {
      if (option === null) {
        this.$store.dispatch('railways/resetRecord')
        this.alight = ''
      } else {
        this.$store.commit('submit-record/setRecord', {
          onboardStopId: option.key,
        })

        // in case choosing alight stop first
        this.$store.dispatch('railways/getFare')
      }
    },
    onAlightStopSelect(option) {
      if (option !== null) {
        this.$store.commit('submit-record/setRecord', {
          alightStopId: option.key,
        })

        this.$store.dispatch('railways/getFare')
      }
    },
  },
}
</script>
