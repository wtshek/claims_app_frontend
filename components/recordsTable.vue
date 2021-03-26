<template>
  <b-table
    :data="processedData"
    striped
    hoverable
    paginated
    :per-page="10"
    :current-page="1"
  >
    <b-table-column v-slot="props" field="dates" :label="$t('display.date')">
      {{ props.row.date }}
    </b-table-column>
    <b-table-column v-slot="props" field="pt" :label="$t('display.typeOfPT')">
      {{ $t(`typeOfPT.${props.row.typeOfPT}`) }}
    </b-table-column>
    <b-table-column v-slot="props" field="from" :label="$t('display.route')">
      {{ props.row.routeName }}
    </b-table-column>
    <b-table-column v-slot="props" field="fare" :label="$t('display.fare')">
      {{ props.row.fare }}
    </b-table-column>
    <b-table-column
      v-slot="props"
      field="approved"
      :label="$t('display.status')"
    >
      <Status :approved="props.row.approved" />
    </b-table-column>
    <b-table-column v-slot="props" cell-class="record_table_func_bts">
      <b-button
        icon-left="pencil-outline"
        class="func-bt"
        @click="onEditBtClick(props.row.id)"
      ></b-button>
      <b-button
        icon-left="delete"
        class="func-bt"
        @click="onDeleteButtonClick(props.row.id)"
      ></b-button>
    </b-table-column>
  </b-table>
</template>
<script>
import { generateRouteNames } from '../utils/utils'
import Status from '../components/status'

export default {
  name: 'RecordsTable',
  components: [Status],
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    onEditBtClick: {
      type: Function,
      default: () => {},
    },
    onDeleteButtonClick: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    processedData() {
      const to = this.$t('to')
      const data = this.data.map((item) => {
        const date = new Date(item.date)
        const routeName = generateRouteNames(this.$store, item, to)
        return { ...item, date: date.toDateString().substring(4), routeName } // take away days
      })
      return data
    },
  },
}
</script>
<style lang="scss">
.record_table_func_bts {
  justify-content: flex-end !important;
  .func-bt {
    outline: none;
    border: none;
    background: inherit;
  }
}
</style>
