import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
// import { browserHistory } from 'react-router'
// import { syncHistoryWithStore } from 'react-router-redux'

import App from './components/App'
import reducer from './reducers'

const store = createStore(reducer)
// const history = syncHistoryWithStore(browserHistory, store)

render(
    <Provider store={store}>
    <App />
    </Provider>,
  document.getElementById('root')
)
