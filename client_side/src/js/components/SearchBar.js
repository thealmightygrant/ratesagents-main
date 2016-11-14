import React, { PropTypes } from 'react'
import StatefulBasicHomeForm from '../containers/StatefulBasicHomeForm'

//TODO: add onKey events?

const searchResults = (searchCompleted, results, onClickLocation) => {
  return results.map((result, idx) => (
    <li onClick={() => onClickLocation(result)}
      key={"searchResult" + idx}>{result.name}</li>
  ))
  //QUESTION: bad to return undefined here?
}

const SearchBar = ({term, searchCompleted, results, onTypeSearch, onClickLocation, onSubmit}) => (
  <div>
  <form
    onSubmit={e => {
        e.preventDefault()
        onSubmit(term)
      }}
    id="searchBar">
    <div>
      <input
        onChange={e => onTypeSearch(e.target.value)}
        placeholder="Where are you selling at?"
        value={term}
        type="text" />
    </div>
    <button className="btn waves-effect waves-light" type="submit">
      <i className="material-icons">search</i>
    </button>
  </form>
  {searchCompleted ?
   <StatefulBasicHomeForm /> :
   <ul>{searchResults(searchCompleted, results, onClickLocation)}</ul> }
  </div>
)

SearchBar.propTypes = {
  term: PropTypes.string.isRequired,
  searchCompleted: PropTypes.bool.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      /* id: PropTypes.string.isRequired,
       * href: PropTypes.string.isRequired, */
      name: PropTypes.string.isRequired
    }).isRequired).isRequired,
  onTypeSearch: PropTypes.func.isRequired,
  onClickLocation: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default SearchBar
