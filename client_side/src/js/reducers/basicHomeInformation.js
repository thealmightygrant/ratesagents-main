import { combineReducers } from 'redux'

const numBedrooms = (state = 2, action) => {
  switch(action.type) {
  case 'CHANGE_BASIC_HOME_INFO':
    return action.homeInfo.numBedrooms || state;
  default:
    return state;
  }
}

const numBathrooms = (state = 2, action) => {
  switch(action.type) {
  case 'CHANGE_BASIC_HOME_INFO':
    return action.homeInfo.numBathrooms || state;
  default:
    return state;
  }
}

const homeType = (state = "house", action) => {
  switch(action.type) {
  case 'CHANGE_BASIC_HOME_INFO':
    return action.homeInfo.homeType || state;
  default:
    return state;
  }
}

const builtIn = (state = 1985, action) => {
  switch(action.type) {
  case 'submit_basic_home_info':
    return action.homeInfo.builtIn || state;
  default:
    return state;
  }
}

//NOTE: with slider use default, for text, leave blank
const approxSize = (state = 1500, action) => {
  switch(action.type) {
  case 'CHANGE_BASIC_HOME_INFO':
    return action.homeInfo.approxSize || state;
  default:
    return state;
  }
}

//NOTE: defaulting to 0.25 acres for now, also a slider
const lotSize = (state = 10000, action) => {
  switch(action.type) {
  case 'CHANGE_BASIC_HOME_INFO':
    return action.homeInfo.lotSize || state;
  default:
    return state;
  }
}

const basicHomeInformation = combineReducers({
  numBedrooms,
  numBathrooms,
  homeType,
  builtIn,
  approxSize,
  lotSize
})

export default basicHomeInformation;
