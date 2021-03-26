<template>
  <div>
    <ValidationProvider v-slot="{ errors }">
      <b-field :label="$t('inputLabel.boarding')">
        <b-autocomplete
          v-model="computedOnboard"
          :data="
            filterAutoComplete(
              stops,
              onboard,
              sortWithWordsMatch(onboard),
              chineseSort
            )
          "
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
          :data="
            filterAutoComplete(
              alightStops,
              alight,
              sortWithWordsMatch(alight),
              chineseSort
            )
          "
          :clearable="true"
          required
          field="name"
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
import { mapState, mapMutations } from 'vuex'
import {
  filterAutoComplete,
  sortWithWordsMatch,
  chineseSort,
} from '../../utils/sumbitRecord'

export default {
  name: 'Ferry',
  components: { ValidationProvider },
  props: { isRecordEdit: Boolean },
  data() {
    return {
      alight: '',
      onboard: '',
    }
  },
  computed: {
    ...mapState({
      lang: (state) => state.user.lang,
      stops: (state) => state.ferry.stops,
      submitRecord: (state) => state['submit-record'],
      PTData: (state) => state.db.PTData,
      alightStops: (state) => state.ferry.alightStops || [],
    }),

    computedOnboard: {
      get() {
        const { onboardStopId } = this.submitRecord.record
        const { stops } = this.PTData

        if (stops && this.lang && onboardStopId) {
          const onboardStop = JSON.parse(JSON.stringify(stops[onboardStopId]))
          return onboardStop.locales[this.lang].name
        } else {
          return ''
        }
      },
      set(val) {
        this.onboard = val
      },
    },
    computedAlight: {
      get() {
        const { alightStopId } = this.submitRecord.record
        const { stops } = this.PTData

        if (stops && this.lang && alightStopId) {
          const alightStop = JSON.parse(JSON.stringify(stops[alightStopId]))
          return alightStop.locales[this.lang].name
        } else {
          return ''
        }
      },
      set(val) {
        this.alight = val
      },
    },
  },
  mounted() {
    this.$store.dispatch('ferry/getStops')

    if (this.isRecordEdit) this.$store.dispatch('ferry/getAlightStops')
  },
  methods: {
    ...mapMutations({
      setRecord: 'submit-record/setRecord',
    }),
    filterAutoComplete,
    sortWithWordsMatch,
    chineseSort,
    onOnboardStopSelect(option) {
      this.setRecord({
        onboardStopId: option ? option.key : '',
        alightStopId: '',
        fare: '',
      })
      if (option !== null) {
        this.$store.dispatch('ferry/getAlightStops')
      }
      this.alight = ''
    },
    onAlightStopSelect(option) {
      if (option !== null) {
        this.$store.dispatch('ferry/getFare', option)
      } else {
        this.setRecord({
          alightStopId: '',
          fare: '',
        })
      }
    },
  },
}
</script>
