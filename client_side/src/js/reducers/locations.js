import { combineReducers } from 'redux'
import searchLocation from './searchLocation'

//   searchCompleted: boolean
const searchCompleted = (state = false, action) => {
  switch (action.type) {
  case 'SEARCHING_LOCATION':
    return false
  case 'PICK_SEARCH_LOCATION':
    return true
  default:
    return state
  }
}


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

// recentLocations: {
//   "0jeakd93": {
//      name: ""
//      href: ""
//   }
// }
//TODO: cap at some number of locations
// const recentLocations = (state = {}, action) => {
//   switch (action.type) {
//   case 'SEARCHING_LOCATION':
//     return state;
//   case 'PICK_SEARCH_LOCATION':
//     return Object.assign({},
//                          {[action.id]: {name: action.name, href: action.href}},
//                          ...state)
//   default:
//     return state;
//   }
// }


// locations : {
//   currentLocation: {
//   name: ""
//   href: ""
//   id: ""
// }
// recentLocations: {
//   "9238kaed": {
//      name: ""
//      href: ""
//   }
// }
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
  searchCompleted,
  searchLocation,
  currentLocation,
  // recentLocations
})

export default locations;
