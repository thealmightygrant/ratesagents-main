import React, { PropTypes } from 'react'

function handleClick(e) {
  e.preventDefault()
  console.log('The bar was clicked.')
}

//TODO: add onKey events?
const SearchBar = ({results, onTypeSearch}) => (
    <form id="searchBar">
    <input
      onClick={handleClick}
      onChange={(e) => onTypeSearch(e.target.value)}
      placeholder="Where are you selling at?"
      type="text" />
    <ul>
      {results.map((result, idx) => (
           <li key={"" + idx}>{result.name}</li>
      ))}
    </ul>
    <input type="submit" value="Submit"/>
    </form>
)

SearchBar.propTypes = {
  /* term: PropTypes.string.isRequired, */
  results: PropTypes.arrayOf(
    PropTypes.shape({
      /* id: PropTypes.number.isRequired,
       * completed: PropTypes.bool.isRequired,*/
      name: PropTypes.string.isRequired
    }).isRequired).isRequired,
  onTypeSearch: PropTypes.func.isRequired
}

export default SearchBar
