import { connect } from 'react-redux'
import { openHelpDrawer } from '../actions'
import HelpButton from '../components/HelpButton'

const mapStateToProps = (state) => {
  return {
    isHelpOpen: state.help.visible,
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    //QUESTION: go straight to results on submit??
    onClickHelp: visible => {
      dispatch(openHelpDrawer({visible}))
    }
  }
}

const HelpButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HelpButton)

export default HelpButtonContainer
