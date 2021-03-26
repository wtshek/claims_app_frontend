<template>
  <div class="custom-container" @click="onParentClick">
    <div v-if="favRoutes.length <= 0" class="custom-table message">
      {{ $t(`message['no_saved_routes']`) }}
    </div>
    <!-- <div class="upper" /> -->
    <b-table
      v-else
      :data="processedData"
      :striped="true"
      :mobile-cards="false"
      :show-header="false"
      class="custom-table"
      :selected.sync="selected"
      @select="onRowSelect"
    >
      <b-table-column v-slot="props" field="route">
        {{ props.row.name }}
      </b-table-column>
      <b-table-column v-slot="props" field="pt">
        {{ props.row.pt }}
      </b-table-column>
      <b-table-column v-slot="props" field="fare">
        {{ props.row.fare }}
      </b-table-column>
    </b-table>
  </div>
</template>
<script>
import { generateRouteNames } from '../utils/utils'

export default {
  name: 'SavedRoutesScrollMenu',
  props: {
    favRoutes: {
      type: Array,
      default: () => [],
    },
    onSelect: {
      type: Function,
      default: () => {},
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selected: {},
    }
  },
  computed: {
    processedData() {
      const cloned = JSON.parse(JSON.stringify(this.favRoutes))
      cloned.forEach((item) => {
        const title = generateRouteNames(this.$store, item, this.$t('to'))
        item.name = title
      })
      return cloned.sort(this.routeSort)
    },
  },
  methods: {
    onParentClick($event) {
      // make sure parent is clicked
      if ($event.target === this.$el) {
        this.$emit('close')
      }
    },
    onRowSelect(row) {
      this.onSelect(row)
      setTimeout(() => {
        this.$emit('close')
      }, 0)
    },
    routeSort(a, b) {
      return b.frequency - a.frequency
    },
  },
}
</script>
<style lang="scss" scoped>
.custom-container {
  height: 100vh;
  display: grid;
  z-index: 0;
}

.message {
  margin: 0 auto;
  color: $primary;
  text-align: center;
  padding-top: 100px;
  font-weight: 800;
}

.upper {
  width: 100vw;
  align-self: stretch;
}
.custom-table {
  //   position: absolute;
  align-self: end;
  background: #ffffff;
  z-index: 1;
  width: 100vw;
  height: 40vh;
  overflow-y: scroll;
  z-index: 1;
}
</style>
