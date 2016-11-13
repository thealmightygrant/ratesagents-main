import { connect } from 'react-redux'
import { searchingLocation } from '../actions'
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
    results: realtimeSearch(state.locations.searchLocation.term)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTypeSearch: (term) => {
      dispatch(searchingLocation(term, realtimeSearch(term)))
    }
  }
}

const RealtimeSearchBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar)

export default RealtimeSearchBar
