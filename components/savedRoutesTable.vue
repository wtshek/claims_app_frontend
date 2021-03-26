<template>
  <b-table :data="processedData" :striped="true">
    <b-table-column
      v-slot="props"
      field="route"
      :label="$t('inputLabel.route')"
    >
      {{ props.row.routeName }}
    </b-table-column>
    <b-table-column
      v-slot="props"
      field="pt"
      :label="$t('inputLabel.typeOfPT')"
    >
      {{ $t(`typeOfPT.${props.row.typeOfPT}`) }}
    </b-table-column>
    <b-table-column v-slot="props" field="fare" :label="$t('inputLabel.fare')">
      {{ props.row.fare }}
    </b-table-column>
    <b-table-column v-slot="props">
      <div>
        <!-- <b-button icon-left="pencil-outline" class="func-bt"></b-button> -->
        <b-button
          icon-left="delete"
          class="func-bt"
          @click="onDelRoute(props.row._id)"
        ></b-button>
      </div>
    </b-table-column>
  </b-table>
</template>
<script>
// how to handle price change ?
// push notification ?
import { generateRouteNames } from '../utils/utils'
export default {
  name: 'SavedRoutesTable',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    editFunc: {
      type: Function,
      default: () => {},
    },
    onDelRoute: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    processedData() {
      const to = this.$t('to')
      const x = this.data.map((item) => {
        return { ...item, routeName: generateRouteNames(this.$store, item, to) }
      })
      return x
    },
  },
}
</script>
<style scoped lang="scss">
.func-bt {
  outline: none;
  border: none;
  background: inherit;
}
</style>
