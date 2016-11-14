import React, { PropTypes } from 'react'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'

const styles = {
  icons: {
    marginRight: 24,
  },
  checkbox: {
    marginBottom: 16,
  }
}

const BasicHomeForm = ({info, onSubmit, onChange}) => (
    <form onSubmit={e => {
            e.preventDefault()
            onSubmit()
          }}
          id="basicHomeInfo">
      <DropDownMenu
        onChange={(e, key, payload) => onChange({numBedrooms: payload})}
        value={info.numBedrooms}>
        <MenuItem value={1} primaryText="1 bedroom" />
        <MenuItem value={2} primaryText="2 bedrooms" />
        <MenuItem value={3} primaryText="3 bedrooms" />
        <MenuItem value={4} primaryText="4 bedrooms" />
        <MenuItem value={5} primaryText="5+ bedrooms" />
      </DropDownMenu>
      <DropDownMenu
        onChange={(e, key, payload) => onChange({numBathrooms: payload})}
        value={info.numBathrooms}>
        <MenuItem value={1} primaryText="1 bathroom" />
        <MenuItem value={2} primaryText="2 bathooms" />
        <MenuItem value={3} primaryText="3 bathrooms" />
        <MenuItem value={4} primaryText="4 bathrooms" />
        <MenuItem value={5} primaryText="5+ bathrooms" />
      </DropDownMenu>
      <DropDownMenu
        onChange={(e, key, payload) => onChange({homeType: payload})}
        value={info.homeType}>
        <MenuItem value={"house"} primaryText="House" />
        <MenuItem value={"condo"} primaryText="Condo" />
        <MenuItem value={"townhome"} primaryText="Townhome" />
      </DropDownMenu>
      {/* TODO: add a half bedroom checkbox, requires local state */}
      <RaisedButton type="submit" label="Search" primary={true} style={styles.button} />
    </form>
)

BasicHomeForm.propTypes = {
  info: PropTypes.shape({
    numBedrooms: PropTypes.number,
    numBathrooms: PropTypes.number,
    homeType: PropTypes.string,  //TODO: maybe make this an enum
    builtIn: PropTypes.number,
    approxSize: PropTypes.number,
    lotSize: PropTypes.number
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default BasicHomeForm
