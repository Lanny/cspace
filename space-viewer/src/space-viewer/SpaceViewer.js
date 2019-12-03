import React from 'react'
import styled from 'styled-components'

import ChemList from '../chem-list/ChemList'
import ChemDetails from '../chem-details/ChemDetails'
import SpaceScene from '../space-scene/SpaceScene'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: Helvetica, sans-serif;
  font-size: 12px;
`

const TopPane = styled.div`
  display: flex;
  width: 100%;
  height: calc(80vw * 0.75);
  max-height: calc(100vh - 250px);
  border-bottom: 1px solid darkgray;
  box-sizing: border-box;
`

const BottomPane = styled.div`
  flex: 1;
`

const SpaceViewer = ({ facetDataUrl }) => {
  const [facet, setFacet] = React.useState()
  const [chemicals, setChemicals] = React.useState()
  const [selectedChem, setSelectedChem] = React.useState(null)
  const [pannedChem, setPannedChem] = React.useState(null)

  React.useEffect(() => {
    fetch(CSpace.facetDataUrl)
      .then(res => res.json())
      .then(res => {
        setFacet(res.facet)
        setChemicals(res.points)
      })
  }, [])

  return (
    <Container>
      <TopPane>
        <SpaceScene
          facet={facet}
          chemicals={chemicals}
          selectedChem={selectedChem}
          setSelectedChem={setSelectedChem}
          pannedChem={pannedChem}
        />
        <ChemList
          facet={facet}
          chemicals={chemicals}
          selectedChem={selectedChem}
          setSelectedChem={setSelectedChem}
          setPannedChem={setPannedChem}
        />
      </TopPane>
      <BottomPane>
        <ChemDetails
          chem={selectedChem}
          setPannedChem={setPannedChem}
        />
      </BottomPane>
    </Container>
  )
}

export default SpaceViewer
