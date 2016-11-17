export const searchingLocation = (term, results) => {
  return {
    type: 'SEARCHING_LOCATION',
    term,
    results
  }
}

export const pickSearchLocation = (location) => {
  return {
    type: 'PICK_SEARCH_LOCATION',
    location
  }
}

export const changeBasicHomeInfo = (homeInfo) => {
  return {
    type: 'CHANGE_BASIC_HOME_INFO',
    homeInfo
  }
}

export const showHomeResults = () => {
  return {
    type: 'SHOW_HOME_RESULTS'
  }
}

export const openHelpDrawer = (help) => {
  return {
    type: 'OPEN_HELP_DRAWER',
    help
  }
}
