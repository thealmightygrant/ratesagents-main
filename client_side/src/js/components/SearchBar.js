import React, {Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import AutoComplete from 'material-ui/AutoComplete'
import SearchIcon from 'material-ui/svg-icons/action/search'
import Popover from 'material-ui/Popover';
import BasicHomeFormPopover from './BasicHomeFormPopover'

const style = {
  wrapper: {
  },
  form: {
    display: "flex"
  },
  searchBox: {
    paddingLeft: "12px",
    paddingBottom: "14px"
  },
  searchIcon: {
    paddingLeft: "12px"
  }
}

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: {},
      open: true
    };
  }

  static propTypes = {
    term: PropTypes.string.isRequired,
    searchCompleted: PropTypes.bool.isRequired,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        /* id: PropTypes.string.isRequired,
         * href: PropTypes.string.isRequired, */
        name: PropTypes.string.isRequired
      }).isRequired).isRequired,
    onTypeSearch: PropTypes.func.isRequired,
    onClickLocation: PropTypes.func.isRequired
  }

  componentDidMount = () => {
    let node = ReactDOM.findDOMNode(this);
    this.setState({
      anchorEl: node
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const {term, searchCompleted, results} = this.props
    const {onTypeSearch, onClickLocation} = this.props

    return (
      <div style={style.wrapper}>
      <SearchIcon
        style={style.searchIcon} />
        <AutoComplete
          floatingLabelText="Where are you selling at?"
          style={style.searchBox}
          filter={AutoComplete.noFilter}
          searchText={term}
          maxSearchResults={4}
          dataSource={results}
          dataSourceConfig={{text: 'name', value: 'name'}}
          onUpdateInput={onTypeSearch}
          onNewRequest={onClickLocation} />
        {searchCompleted ? <BasicHomeFormPopover
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          handleCloseForPopover={this.handleRequestClose}/> : ""}
      </div>
    )
  }
}

export default SearchBar
