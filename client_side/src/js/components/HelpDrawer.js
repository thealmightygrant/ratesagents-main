import React, { PropTypes } from 'react'
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close';

const HelpDrawerCloseButton = ({closeHelpDrawer}) => (
    <IconButton onClick={e => closeHelpDrawer()}>
    <NavigationClose />
    </IconButton>
)

const HelpDrawer = ({visible, closeHelpDrawer}) => (
    <Drawer width={350} openSecondary={true} open={visible} >
    <AppBar
  title="Rates and Agents Help"
  showMenuIconButton={false}
  iconElementRight={<HelpDrawerCloseButton closeHelpDrawer={closeHelpDrawer} />} />
    </Drawer>
)

HelpDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeHelpDrawer: PropTypes.func.isRequired
}


export default HelpDrawer
