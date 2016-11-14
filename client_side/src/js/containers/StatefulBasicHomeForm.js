import { connect } from 'react-redux'
import { showHomeResults, changeBasicHomeInfo } from '../actions'
import BasicHomeForm from '../components/BasicHomeForm'

const mapStateToProps = (state) => {
  return {
    info: state.homeInformation.basic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    //QUESTION: go straight to results on submit??
    onSubmit: () => {
      dispatch(showHomeResults())
    },
    onChange: info => {
      dispatch(changeBasicHomeInfo(info))
    }
  }
}

const StatefulBasicHomeForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicHomeForm)

export default StatefulBasicHomeForm
