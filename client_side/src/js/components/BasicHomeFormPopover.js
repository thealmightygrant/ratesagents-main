import React, {Component, PropTypes } from 'react'
import Popover from 'material-ui/Popover';
import BasicHomeFormContainer from '../containers/BasicHomeFormContainer'

const style = {
  popover: {
  }
}


class BasicHomeFormPopover extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    anchorEl: PropTypes.object.isRequired,
    handleCloseForPopover: PropTypes.func.isRequired
  }

  render() {
    const {open, anchorEl} = this.props
    const {handleCloseForPopover} = this.props

    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        style={style.popover}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={handleCloseForPopover}
      >
        <BasicHomeFormContainer />
      </Popover>
    )
  }
}

export default BasicHomeFormPopover
