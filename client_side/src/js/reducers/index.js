import { combineReducers } from 'redux'
import locations from './locations'
import homeInformation from './homeInformation'
import help from './help'

const homeownerDashboard = combineReducers({
  locations,
  homeInformation,
  help
})

export default homeownerDashboard
