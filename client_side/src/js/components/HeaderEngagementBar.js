import React, {PropTypes} from 'react'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import AccountIcon from 'material-ui/svg-icons/action/account-circle'
import {grey300} from 'material-ui/styles/colors'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import HelpButtonContainer from '../containers/HelpButtonContainer'
import SearchBarContainer from '../containers/SearchBarContainer'

const style = {
  image: {
    width: "42px",
    height: "42px"
  },
  searchBar: {
    marginLeft: "24px"
  },
  toolbar: {
    backgroundColor: "none",
    paddingBottom: "12px",
    height: "68px",
    borderBottom: "1px solid " + grey300
  }
}

const HeaderEngagementBar = ({searchCompleted}) => (
  <Toolbar style={style.toolbar}>
    <ToolbarGroup style={style.leftGroup}>
      <img src="/images/ra-icon.png" style={style.image}/>
      <ToolbarSeparator />
      <SearchBarContainer style={style.searchBar} />
    </ToolbarGroup>
    <ToolbarGroup style={style.rightGroup} lastChild={true}>
      <RaisedButton label="Watch a Realtor Auction" primary={true} />
      <RaisedButton label="Find a new Realtor" primary={true} />
      <HelpButtonContainer />
      <IconMenu
        iconButtonElement={
          <IconButton touch={true}>
            <AccountIcon />
          </IconButton>}>
          <MenuItem primaryText="More Info" />
      </IconMenu>
    </ToolbarGroup>
  </Toolbar>
)

HeaderEngagementBar.propTypes = {
  searchCompleted: PropTypes.bool.isRequired
}

export default HeaderEngagementBar
