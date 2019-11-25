import React from 'react'
import ReactDOM from 'react-dom'
 
import SpaceViewer from '../space-viewer/SpaceViewer'

const root = document.getElementById('root')
const viewer = <SpaceViewer facetDataUrl={window.CSpace.facetDataUrl} />

ReactDOM.render(viewer, root)
