import React, {PropTypes} from 'react'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import {Tabs, Tab} from 'material-ui/Tabs';
import {grey300, blueGrey500} from 'material-ui/styles/colors'


const styles = {
  image: {
    width: "42px",
    height: "42px"
  },
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  toolbar: {
  },
  tabs: {
    height: "42px",
    backgroundColor: blueGrey500,
    color: "white",
    paddingBottom: "12px"
  }
}

const HeaderNavigationBar = () => (
  <Tabs style={styles.toolbar}>
    <Tab style={styles.tabs} label="Dashboard" >
      <div>
        <h2 style={styles.headline}>Dashboard</h2>
      </div>
    </Tab>
    <Tab style={styles.tabs} label="Your Listings" >
      <div>
        <h2 style={styles.headline}>Your Listings</h2>
      </div>
    </Tab>
    <Tab style={styles.tabs} label="Inbox" >
      <div>
        <h2 style={styles.headline}>Inbox</h2>
      </div>
    </Tab>
    <Tab style={styles.tabs} label="Profile" >
      <div>
        <h2 style={styles.headline}>Profile</h2>
      </div>
    </Tab>
  </Tabs>
)

export default HeaderNavigationBar
