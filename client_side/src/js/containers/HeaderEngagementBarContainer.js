import { connect } from 'react-redux'
import { openHelpDrawer } from '../actions'
import HeaderEngagementBar from '../components/HeaderEngagementBar'

const mapStateToProps = (state) => {
  return {
    searchCompleted: state.locations.searchCompleted,
  }
}

const HeaderEngagementBarContainer = connect(
  mapStateToProps
)(HeaderEngagementBar)

export default HeaderEngagementBarContainer
