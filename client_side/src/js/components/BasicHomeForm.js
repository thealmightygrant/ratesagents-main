import React, { PropTypes } from 'react'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'

const styles = {
  icons: {
    marginRight: "24px",
  },
  checkbox: {
    paddingLeft: "21px",
    paddingTop: "24px",
    paddingBottom: "12px"
  },
  form: {
    height: "180px",
    padding: "24px",
    overflowX: "none",
    overflowY: "none"
  }
}

const BasicHomeForm = ({info, onSubmit, onChange}) => (
  <form onSubmit={e => {
      e.preventDefault()
      onSubmit()
    }}
    style={styles.form}
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
      value={Math.floor(info.numBathrooms)}>
      <MenuItem value={1} primaryText="1 bathroom" />
      <MenuItem value={2} primaryText="2 bathrooms" />
      <MenuItem value={3} primaryText="3 bathrooms" />
      <MenuItem value={4} primaryText="4 bathrooms" />
      <MenuItem value={5} primaryText="5+ bathrooms" />
    </DropDownMenu>
    <Checkbox
      label="+ 0.5 bathrooms"
      value={!(info.numBathrooms - Math.floor(info.numBathrooms))}
      onCheck={(e, checked) => {
          let halfNumBath = checked ? 0.5 : -1 * (info.numBathrooms - Math.floor(info.numBathrooms))
          onChange({
            numBathrooms: (info.numBathrooms + halfNumBath),
          })}}
      style={styles.checkbox} />
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
