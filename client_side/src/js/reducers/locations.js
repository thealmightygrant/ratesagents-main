import { combineReducers } from 'redux'

//   currentLocation: {
//   name: ""
//   href: ""
//   id: ""
// }
const currentLocation = (state = {}, action) => {
  switch (action.type) {
  case 'SEARCHING_LOCATION':
    return state
  case 'PICK_SEARCH_LOCATION':
    return Object.assign({}, state, {
      id: action.location.id,
      name: action.location.name,
      href: action.location.href
    })
  default:
    return state
  }
}

// recentLocations: [
//   {
//      id: ""
//      name: ""
//      href: ""
//   }
// ]
const recentLocations = (state = [], action) => {
  switch (action.type) {
  case 'SEARCHING_LOCATION':
    return state;
  case 'PICK_SEARCH_LOCATION':
    return [
      ...state,
      {
        id: action.location.id,
        name: action.location.name,
        href: action.location.href
      }
    ]
  default:
    return state;
  }
}

//TODO: maybe need to break this out into individual results depends on search backend
const results = (state = [], action) => {
  switch(action.type) {
  case 'SEARCHING_LOCATION':
    return Object.assign([], action.results);
  case 'PICK_SEARCH_LOCATION':
    return [];
  default:
    return state;
  }
}

const term = (state = "", action) => {
  switch(action.type) {
  case 'SEARCHING_LOCATION':
    return action.term;
  case 'PICK_SEARCH_LOCATION':
    return "";
  default:
    return state;
  }
}

const searchLocation = combineReducers({
  term,
  results
})

// locations : {
//   currentLocation: {
//   name: ""
//   href: ""
//   id: ""
// }
// recentLocations: [
//   {
//      id: ""
//      name: ""
//      href: ""
//   }
// ]
// searchLocation: {
//   term: ""
//   results: [
//     {
//       id: ""
//       name: ""
//       href: ""
//     }
//   ]
// }
// }

const locations = combineReducers({
  searchLocation,
  currentLocation,
  recentLocations
})

export default locations;
