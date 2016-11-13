import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import locations from './locations'

const homeownerDashboard = combineReducers({
  locations,
  formReducer
})

export default homeownerDashboard
