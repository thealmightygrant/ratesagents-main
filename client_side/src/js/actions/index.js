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
