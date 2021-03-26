<template>
  <div>
    <div v-for="col in columns" :key="col.field" class="input-container">
      <b-field
        class="custom-field"
        custom-class="custom-label"
        :label="$t(`profile.${col.field}`)"
        :label-position="labelPosition"
      >
        <div>{{ col.value }}</div>
      </b-field>
    </div>
    <b-button
      class="save-bt button"
      type="is-primary"
      :disabled="saveBtDisabled"
      @click="saveFunc"
    >
      Save
    </b-button>
  </div>
</template>
<script>
export default {
  name: 'Profile',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    saveFunc: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      file: {},
      labelPosition: 'ob-border',
      saveBtDisabled: true,
    }
  },
  computed: {
    columns() {
      const { name, department, phone } = this.data
      return [
        { field: 'name', value: name },
        { field: 'department', value: department },
        { field: 'phone', value: phone },
      ]
    },
  },
  methods: {
    onInputChange() {
      this.saveBtDisabled = false
    },
  },
}
</script>
<style scoped lang="scss">
.profile-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.profile-pic {
  margin: 50px auto 0;
}

.input-container:not(:first-child) {
  margin-top: 20px;
}

.save-bt {
  margin: 35px 0;
}

.logout-bt {
  width: 100%;
}

.button {
  display: block;
}
</style>
