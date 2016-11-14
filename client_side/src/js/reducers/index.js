import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import locations from './locations'
import homeInformation from './homeInformation'

const homeownerDashboard = combineReducers({
  locations,
  homeInformation,
  formReducer
})

export default homeownerDashboard
