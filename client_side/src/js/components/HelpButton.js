import React, { PropTypes } from 'react'
import HelpIcon from 'material-ui/svg-icons/action/help'
import IconButton from 'material-ui/IconButton'

const HelpButton = ({isHelpOpen, onClickHelp}) => (
    <IconButton touch={true} onClick={e => onClickHelp(!isHelpOpen)}>
    <HelpIcon />
    </IconButton>
)

HelpButton.propTypes = {
  isHelpOpen: PropTypes.bool.isRequired,
  onClickHelp: PropTypes.func.isRequired
}


export default HelpButton
