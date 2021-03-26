import localforage from 'localforage'

export const user = localforage.createInstance({ name: 'user' })
export const records = localforage.createInstance({ name: 'records' })
