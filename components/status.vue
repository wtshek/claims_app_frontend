<template>
  <div>
    <b-icon
      v-if="approved === true"
      icon="check-circle"
      size="is-small"
      type="is-success"
    >
    </b-icon>
    <b-icon
      v-else-if="approved === false"
      icon="close-circle"
      size="is-small"
      type="is-danger"
    >
    </b-icon>
    <b-icon v-else icon="account-clock" size="is-small" type="is-primary">
    </b-icon>
  </div>
</template>
<script>
export default {
  name: 'Status',
  props: {
    approved: Boolean || 'pending',
  },
}
</script>
