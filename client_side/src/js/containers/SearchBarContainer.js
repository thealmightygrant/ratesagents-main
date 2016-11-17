import { connect } from 'react-redux'
import { searchingLocation, pickSearchLocation } from '../actions'
import SearchBar from '../components/SearchBar'
import dallasNeighborhoods from '../constants/dallas_neighborhoods'

const realtimeSearch = (term) => {
  let searchString = term.trim().toLowerCase();
  let results = []
  if (searchString.length > 0) {
    results = dallasNeighborhoods.filter((hood) => {
      return (hood.name.toLowerCase().indexOf(searchString) !== -1)
    })
  }
  return results;
}

const mapStateToProps = (state) => {
  return {
    term: state.locations.searchLocation.term,
    searchCompleted: state.locations.searchCompleted,
    results: realtimeSearch(state.locations.searchLocation.term)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTypeSearch: (value, source) => {
      dispatch(searchingLocation(value, realtimeSearch(value)))
    },
    onClickLocation: (value, index) => {
      //TODO: validate input
      if(index === -1){
        let searchResults = realtimeSearch(value)
        if(searchResults.length)
          dispatch(pickSearchLocation(searchResults[0]))
        // else
        //   dispath(error())
      }
      else {
        dispatch(pickSearchLocation(value))
      }
    }
  }
}

const SearchBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar)

export default SearchBarContainer
