import { records } from '../utils/localForageInstance'
import api from '../config/api'
export const state = () => ({
  data: [],
})

export const mutations = {
  setRecords(state, records) {
    state.data = records
  },
}

const isOnline = true
// const isOnline = navigator.onLine
const subRecordsKey = 'submissonRecords'
const tempRecordsKey = 'tempSavedRecords'

export const actions = {
  async getRecords({ commit }) {
    let data = []
    const submitted = await records.getItem(subRecordsKey)
    const temp = await records.getItem(tempRecordsKey)
    if (submitted) data = [...submitted]
    if (temp) data = [...data, ...temp]

    commit('setRecords', data)
  },

  async addRecords(context, { records }) {
    try {
      if (isOnline) {
        await this.$axios.post('')
      }
    } catch (err) {
      throw new Error('Records not added, please try again')
    }
  },

  async addRecord(context, record) {
    let res
    if (isOnline) {
      try {
        res = await this.$axios.$post(api.addRecord(), record)
        res = {
          ...res,
          date: new Date(res.date),
          fare: parseFloat(res.fare),
        }
      } catch (err) {
        return new Error('Record not added, please try again')
      }
    }
    const oldRecords = await records.getItem(subRecordsKey)
    await records.setItem(
      subRecordsKey,
      oldRecords ? [...oldRecords, res] : [res]
    )
    if (res) return res
  },

  async editRecord(context, record) {
    let res
    if (isOnline) {
      try {
        res = await this.$axios.$post(api.editRecord(record.id), record)
      } catch (err) {
        return new Error('Record not edited, please try again')
      }
    }
    const oldRecords = await records.getItem(subRecordsKey)
    const mapped = oldRecords.map((item) => {
      if (item.id === record.id) return record
      else return item
    })
    await records.setItem(subRecordsKey, mapped)
    return res
  },

  async saveToTemp(context, record) {},

  async deleteRecord(context, id) {
    const res = await this.$axios.$post(api.deleteRecord(id))
    if (res) {
      const oldRecords = await records.getItem(subRecordsKey)
      const filtered = oldRecords.filter((item) => item.id !== id)
      await records.setItem(subRecordsKey, filtered)
    }
  },
}
