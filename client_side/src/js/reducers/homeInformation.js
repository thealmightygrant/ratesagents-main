import { combineReducers } from 'redux'
import basicHomeInformation from './basicHomeInformation'

// homeInformation = {
//   basic = {
//     numBedrooms = number
//     numBathrooms = number (possibly not whole)
//     homeType = enum(Condo, house, townhome) // land??
//     builtIn = number
//     approxSize = number (square feet)
//     lotSize = number (square feet, prob display in acres as well)
//   }
//   parking = {
//     private = boolean
//     covered = boolean
//     reserved = boolean
//     exists = boolean
//   }
//   backyard = {
//     private = boolean
//     exists = boolean
//   }
//   pool = {
//     private = boolean
//     exists = boolean
//     approxSize = number (square feet)
//   }
//   spa = {
//     private = boolean
//     exists = boolean
//     approxSize = number (square feet)
//   }
//   storage = {
//     private = boolean
//     exists = boolean
//     covered = boolean
//     approxSize = number (square feet)
//   }
//   other = {
//     TBD
//   }
// }

const homeInformation = combineReducers({
  basic: basicHomeInformation
})

export default homeInformation;
