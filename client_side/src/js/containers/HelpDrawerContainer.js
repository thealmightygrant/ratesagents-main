import { connect } from 'react-redux'
import { openHelpDrawer } from '../actions'
import HelpDrawer from '../components/HelpDrawer'

const mapStateToProps = (state) => {
  return {
     visible: state.help.visible,
   }
 }

const mapDispatchToProps = (dispatch) => {
  return {
    //QUESTION: go straight to results on submit??
    closeHelpDrawer: () => {
      dispatch(openHelpDrawer({visible: false}))
    }
  }
}

const HelpDrawerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HelpDrawer)

export default HelpDrawerContainer
