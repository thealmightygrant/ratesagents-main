import { combineReducers } from 'redux'

//   searchCompleted: boolean
const visible = (state = false, action) => {
  switch (action.type) {
  case 'OPEN_HELP_DRAWER':
    return action.help.visible;
  default:
    return state
  }
}


const help = combineReducers({
  visible,
  //searchLocation,
  // currentLocation,
  // recentLocations
})

export default help;
