<template>
  <div class="text-center">
    <vc-calendar
      class="custom-calendar max-w-full"
      :masks="masks"
      :attributes="attributes"
      is-expanded
      :min-page="minPage"
      :locale="userLang"
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="day-container" @click="calendarModal(attributes)">
          <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
          <div class="spot-container flex-grow overflow-y-auto overflow-x-auto">
            <p
              v-for="attr in attributes"
              :key="attr.key"
              class="spot leading-tight rounded-sm p-1 mt-0 mb-1"
              :class="attr.customData.class"
            ></p>
            <p v-if="attributes && attributes.length > 6">...</p>
          </div>
        </div>
      </template>
    </vc-calendar>
  </div>
</template>

<script>
import CalendarModal from './calendarModal/index'

export default {
  name: 'Calendar',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    modalRedirect: {
      type: String,
      default: '/',
    },
    onEditBtClick: {
      type: Function,
      default: () => {},
    },
    onDeleteBtClick: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      isModalOpen: false,
      windowWidth: window.innerWidth,
    }
  },
  computed: {
    minPage() {
      const d = new Date()
      let month = d.getMonth()
      let year = d.getFullYear()
      if (month <= 3) {
        month = 12 - 2 + month
        year = year - 1
      } else {
        month = month - 2
      }
      return { month, year }
    },
    onboardStop() {
      return this.getStopsName(this.data.onboardStopKey)
    },
    userLang() {
      return this.$store.state.user.lang
    },
    masks() {
      return {
        weekdays: 'WWW',
        title: this.userLang === 'en' ? 'MMM YYYY' : 'YYYY MMM',
      }
    },
    attributes() {
      const cloned = JSON.parse(JSON.stringify(this.data))
      cloned.forEach((data, i) => {
        const { typeOfPT, date } = data
        // setting background color
        cloned[i] = {
          key: i,
          customData: {
            class: typeOfPT ? typeOfPT.toLowerCase() : '',
            ...data,
          },

          // must call dates, cant change
          dates: new Date(date),
        }
      })
      return cloned
    },
  },

  methods: {
    onToggleModal() {
      this.isModalOpen = !this.isModalOpen
    },
    closeModal() {
      this.isModalOpen = false
    },
    calendarModal(attributes) {
      if (attributes.length <= 0) return
      this.$buefy.modal.open({
        parent: this,
        component: CalendarModal,
        hasModalCard: true,
        trapFocus: true,
        fullScreen: true,
        props: {
          data: attributes,
          redirectLink: this.modalRedirect,
          closeModal: this.closeModal,
          onEditBtClick: this.onEditBtClick,
          onDeleteBtClick: this.onDeleteBtClick,
        },
      })
    },
    getStopName(id) {
      return this.$store.state.db.getStopName(id)
    },
  },
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0px;
}
::-webkit-scrollbar-track {
  display: none;
}

.day-container {
  height: 100%;
  margin-left: 1vw;
  height: min(85px, 20vw);
}

.spot-container {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);

  p:nth-child(n + 7):not(:last-child) {
    display: none;
  }

  P:last-child {
    line-height: 7px;
    font-size: max(14px, 3vw);
  }

  @media screen and (max-width: 330px) {
    grid-template-columns: repeat(2, 1fr);

    p:nth-child(n + 5):not(:last-child) {
      display: none;
    }
  }
}

.spot {
  width: min(2vw, 14px);
  height: min(2vw, 14px);
  overflow: hidden;
  color: $primary-invert;
  border-radius: 10px;
  padding: 2px 4px;
  font-size: 0.8rem;
  text-align: center;
  flex-shrink: 0;
}

.bus {
  background: #ff00009c;
}

.tram {
  background: #008000b5;
}

.mtr_lines,
.airport_express,
.light_rail {
  background: #0000ff94;
}

.ferry {
  background: #800080a8;
}

.minibus {
  background: rgb(255, 238, 0);
}

.custom-calendar.vc-container {
  border-radius: 0;
  width: 100%;

  & .vc-header {
    background-color: #f1f5f8;
    padding: 10px 0;
  }
  & .vc-weeks {
    padding: 0;
  }
  .vc-weekday {
    padding: 10px 0;
  }
  .vc-day {
    // padding: 0 5px 3px 5px;
    // text-align: left;
    // height: var(--day-height);
    // min-width: var(--day-width);
    // background-color: white;
    // border: 1px solid #fff5f5;

    //   &.weekday-1,
    //   &.weekday-7 {
    //     background-color: #eff8ff;
    //   }
    //   &:not(.on-bottom) {
    //     border-bottom: var(--day-border);
    //     &.weekday-1 {
    //       border-bottom: var(--day-border-highlight);
    //     }
    //   }
    //   &:not(.on-right) {
    //     border-right: var(--day-border);
    //   }
    // }
    // & .vc-day-dots {
    //   margin-bottom: 5px;
    //
  }
}
</style>
<style>
.vc-grid-cell {
  overflow: hidden;
}

.vc-day {
  border: 1px solid rgb(161 159 159 / 15%);
}
</style>
