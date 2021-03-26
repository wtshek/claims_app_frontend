<template>
  <v-tour name="myTour" :steps="steps">
    <template slot-scope="tour">
      <transition name="fade">
        <v-step
          v-if="tour.steps[tour.currentStep]"
          :key="tour.currentStep"
          :step="tour.steps[tour.currentStep]"
          :previous-step="tour.previousStep"
          :next-step="tour.nextStep"
          :stop="tour.stop"
          :skip="tour.skip"
          :is-first="tour.isFirst"
          :is-last="tour.isLast"
          :labels="tour.labels"
        >
          <template v-if="tour.currentStep === steps.length - 1">
            <div slot="actions">
              <button class="btn btn-primary" @click="tour.stop">
                {{ $t('tour.buttons.stop') }}
              </button>
            </div>
          </template>
          <template v-else>
            <div slot="actions">
              <button class="btn btn-primary" @click="tour.skip">
                {{ $t('tour.buttons.skip') }}
              </button>
              <button class="btn btn-primary" @click="tour.nextStep">
                {{ $t('tour.buttons.next') }}
              </button>
            </div>
          </template>
        </v-step>
      </transition>
    </template>
  </v-tour>
</template>
<script>
export default {
  name: 'MyTour',
  props: {
    goTour: Boolean,
  },
  data() {
    return {
      steps: [
        {
          target: '[data-v-step="1"]', // func button
          content: this.$t('tour.steps.step_1'),
          params: {
            placement: 'top',
          },
        },
        {
          target: '[data-v-step="2"]', // calendar
          content: this.$t('tour.steps.step_2'),
          params: {
            placement: 'bottom',
          },
        },
        {
          target: '[data-v-step="3"]', // change view selector
          content: this.$t('tour.steps.step_3'),
          params: {
            placement: 'left', // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
          },
        },
      ],
    }
  },
  mounted() {
    if (this.goTour) {
      this.$tours.myTour.start()
    }
  },
  methods: {},
}
</script>
