<template>
  <div>
    <div class="card">
      <div class="date">{{ date }}</div>
      <hr />
      <ul ref="listContainer">
        <li v-for="(item, i) in processedData" :key="item.key">
          <ListItem
            :item="item"
            :close-modal="closeModal"
            :on-edit-bt-click="onEditBtClick"
            :on-delete-bt-click="onDeleteBtClick"
            :last-item="i === processedData.length - 1"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { generateRouteNames } from '../../utils/utils'
import ListItem from './ListItem.vue'

export default {
  names: 'CalendarModal',
  components: {
    ListItem,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    redirectLink: {
      type: String,
      default: () => '/',
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
  computed: {
    date() {
      if (
        this.data[0] &&
        Object.keys(this.data[0]).length >= 1 &&
        this.data[0].constructor === Object
      ) {
        const d = new Date(this.data[0].customData.date)
        return d.toLocaleDateString('en-GB')
      }
      return ''
    },
    lang() {
      return this.$store.state.user.lang
    },
    processedData() {
      // const { stops, routes } = this.$store.state.db.PTData
      return this.data.map((item) => {
        const to = this.$t('to')

        return {
          ...item,
          title: generateRouteNames(this.$store, item.customData, to),
        }
      })
    },
  },
  methods: {
    closeModal() {
      this.$parent.close()
    },
  },
}
</script>

<style scoped lang="scss">
.card {
  width: 90%;
  margin: 50vh auto;
  transform: translateY(-50%);
  padding: 5px 0 0 10px;
  max-height: 70vh;
  overflow: hidden;
  ul {
    list-style: none;
    overflow: scroll;
    max-height: 52vh; // minus other element in the card element
  }
}

.date {
  text-align: center;
  font-size: 1.5rem;
}

button {
  outline: none;
  background: none;
  border: none;
  margin-right: 0;
  margin-left: auto;
  display: flex;
}

.add-icon {
  background: $primary;
  border-radius: 20px;
}

@media screen and (min-width: 1024px) {
  .card {
    width: 35%;
  }
}
</style>
