<template>
  <div ref="container" class="container">
    <div class="data">
      <Status :approved="item.customData.approved" />
      <div class="unselectable">{{ item.title }}</div>
      <div class="fare unselectable">{{ item.customData.fare }}</div>
      <b-dropdown
        id="dropdown-menu"
        ref="editMenu"
        aria-role="list"
        :mobile-modal="false"
        class="dropdown-container"
        @active-change="toggleHeight()"
      >
        <MenuSVG slot="trigger" class="menu" />
        <b-dropdown-item aria-role="listitem" @click="editRecord()">{{
          $t('editMenu.edit')
        }}</b-dropdown-item>
        <b-dropdown-item
          ref="last-item"
          aria-role="listitem"
          @click="deleteRecord()"
          >{{ $t('editMenu.delete') }}</b-dropdown-item
        >
      </b-dropdown>
    </div>
    <hr />
  </div>
</template>

<script>
import MenuSVG from '../../assets/svg/menu.svg?inline'
import Status from '../../components/status'

export default {
  name: 'ListItem',
  components: { MenuSVG, Status },
  props: {
    item: Object,
    closeModal: Function,
    scrollToEditMenu: Function,
    onEditBtClick: Function,
    lastItem: Boolean,
    onDeleteBtClick: Function,
  },
  data() {
    return {
      isShowToolbar: false,
      dropdownRef: '',
    }
  },

  methods: {
    toggleToolbar() {
      this.isShowToolbar = !this.isShowToolbar
    },
    editRecord() {
      this.closeModal()
      this.onEditBtClick(this.item.customData.id)
    },
    toggleHeight() {
      if (!this.lastItem) return
      const height = this.$refs.container.style.height
      return (this.$refs.container.style.height =
        height === '160px' ? '' : '160px')
    },
    deleteRecord() {
      this.closeModal()
      console.log(this.onDeleteBtClick)
      this.onDeleteBtClick(this.item.customData.id)
    },
  },
}
</script>
<style lang="scss" scoped>
.container {
  transition: height 0.2s linear;
}
.editTools {
  display: flex;
  background: #cccccc63;
  border-top: 1px solid #00000040;
  margin-top: 5px;
  padding: 2px 10px;

  & > div:nth-child(1) {
    margin-right: 10px;
  }
}

.data {
  display: flex;
  flex-direction: row;
  align-items: center;
  grid-gap: 3vw;
  font-size: 1rem;

  svg {
    fill: #8e8a856b;
  }

  svg.status {
    min-width: 28px;
  }

  svg.menu {
    min-width: 28px;
    margin-bottom: 5px;
  }
}

.fare {
  margin-left: auto;
}
hr {
  margin: 0 0 1rem 0;
}

.unselectable {
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
}
</style>
<style>
.dropdown-menu {
  left: unset;
  right: 0;
}
</style>
