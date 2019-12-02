import React from 'react'
import styled from 'styled-components'

import ChemList from '../chem-list/ChemList'
import ChemDetails from '../chem-details/ChemDetails'
import SpaceScene from '../space-scene/SpaceScene'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const TopPane = styled.div`
  display: flex;
  width: 100%;
  height: 600px;
`

const BottomPane = styled.div`
  height: 300px;
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
          pannedChem={pannedChem}
        />
        <ChemList
          chemicals={chemicals}
          selectedChem={selectedChem}
          setSelectedChem={setSelectedChem}
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
