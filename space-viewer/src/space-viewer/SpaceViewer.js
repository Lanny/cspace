import React from 'react'
import styled from 'styled-components'

import ChemList from '../chem-list/ChemList'
import SpaceScene from '../space-scene/SpaceScene'

const ViewerContainer = styled.div`
  display: flex;
  width: 100%;
`

const SpaceViewer = ({ facetDataUrl }) => {
  const [facet, setFacet] = React.useState()
  const [chemicals, setChemicals] = React.useState()

  React.useEffect(() => {
    fetch(CSpace.facetDataUrl)
      .then(res => res.json())
      .then(res => {
        setFacet(res.facet)
        setChemicals(res.points)
      })
  }, [])

  return (
    <ViewerContainer>
      <SpaceScene facet={facet} chemicals={chemicals} />
      <ChemList chemicals={chemicals} />
    </ViewerContainer>
  )
}

export default SpaceViewer
