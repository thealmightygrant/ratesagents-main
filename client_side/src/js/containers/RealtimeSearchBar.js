import { connect } from 'react-redux'
import { searchingLocation, pickSearchLocation } from '../actions'
import dallas_neighborhoods from '../constants/dallas_neighborhoods'
import SearchBar from '../components/SearchBar'

const realtimeSearch = (term) => {
  let searchString = term.trim().toLowerCase();
  let results = []
  if (searchString.length > 0) {
    results = dallas_neighborhoods.filter((hood) => {
        return hood.name.toLowerCase().match( searchString );
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
    //QUESTION: go straight to results on submit??
    onSubmit: term => {
      if(realtimeSearch(term).length)
        dispatch(pickSearchLocation(realtimeSearch(term)[0]))
    },
    onTypeSearch: term => {
      dispatch(searchingLocation(term, realtimeSearch(term)))
    },
    onClickLocation: location => {
      dispatch(pickSearchLocation(location))
    }
  }
}

const RealtimeSearchBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar)

export default RealtimeSearchBar
