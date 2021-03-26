export const sortWithBusNumber = (a, b) => {
  const [nameA, ,] = a.name.split(' ')
  const [nameB, ,] = b.name.split(' ')

  // test if bus name begin with letters
  // if yes, move to bottom
  const regexAtBegin = /^[A-Za-z]+/
  const beginTestA = regexAtBegin.test(nameA)
  const beginTestB = regexAtBegin.test(nameB)
  if (beginTestA && !beginTestB) return 1

  const numberRegx = /^\d+/
  const numA = Number(nameA.match(numberRegx))
  const numB = Number(nameB.match(numberRegx))
  if (numA !== numB) return numA - numB
  // both have same number
  else if (numA === numB) {
    // check if contains alphabet at beginning
    const alphabetRegex = /[A-Za-z]+/
    const alphabetA = nameA.match(alphabetRegex)
    const alphabetB = nameB.match(alphabetRegex)

    if (!alphabetA && !alphabetB) return -1

    if (alphabetA && alphabetB) {
      return alphabetA < alphabetB
    }
    if (alphabetA && !alphabetB) return 1
    if (!alphabetA && alphabetB) return -1
  }
}

export const sortWithWordsMatch = (input) => (a, b) => {
  const range = input.length
  const nameA = a.name.substring(0, range).toLowerCase()
  const nameB = b.name.substring(0, range).toLowerCase()
  const lowerCaseInput = input.toLowerCase()

  if (nameA !== lowerCaseInput && nameB === lowerCaseInput) return 1
  else if (nameA === lowerCaseInput && nameB !== lowerCaseInput) return 0
}

export const filterAutoComplete = (computed, data, ...sortFuncs) => {
  if (!computed && !data) return []
  const filtered = computed.filter((option) => {
    const name = option.name.toLowerCase()
    const input1 = data.split(' ')[0].toLowerCase()
    // if str begins with number
    if (input1.match(/^\d/)) {
      return name.startsWith(input1)
    }
    return name.startsWith(data.toLowerCase())
  })

  // if (sortFuncs) return filtered.sort(sortFunc)
  if (sortFuncs) {
    sortFuncs.forEach((func) => {
      filtered.sort(func)
    })
  }

  return filtered
}

export const onOnboardStopSelect = (option) => {
  if (option === null && this.alight) this.alight = ''
  this.$store.commit('pt/setRecord', { onboard: option })
  if (
    this.selectedType === 'bus' ||
    this.selectedType === 'minibus' ||
    this.selectedType === 'ferry'
  ) {
    this.$store.dispatch('pt/getAbortStops', option)
  }
}

export const onAbortStopSelect = (option) => {
  this.$store.commit('pt/setRecord', { alight: option })
}

export const getEffectiveChart = (charts, date) => {
  let chart

  console.log(charts)
  // start from the end to get the latest
  for (let i = charts.length - 1; i >= 0; i--) {
    if (
      (charts[i].effective_date && new Date(charts[i].effective_date)) <= // check if this one is effective
        date ||
      !charts[i].effective_date // or no effective data provided (means the init database and no update yet)
    ) {
      chart = charts[i]
    }
  }

  return chart
}

export const chineseSort = (a, b) => {
  return a.name.localeCompare(b.name, 'zh-Hant-CN')
}

/**
 * pass in the chart object e.g. {1: {chart}}
 * return key of the suitable chart
 * @param {obj, date} chartObj, date
 * @returns {key}
 */
export const chartValidate = (chartObj, date) => {
  let key

  Object.entries(chartObj).forEach(([key, val]) => {
    console.log(val.effective_date)
  })

  return key
}
