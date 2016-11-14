import { combineReducers } from 'redux'

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

//TODO: maybe need to break this out into individual results depends on search backend
const results = (state = [], action) => {
  switch(action.type) {
  case 'SEARCHING_LOCATION':
    return action.results.map((r) => { return Object.assign({}, r); })
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
    return action.location.name;
  default:
    return state;
  }
}

const searchLocation = combineReducers({
  term,
  results
})

export default searchLocation;
