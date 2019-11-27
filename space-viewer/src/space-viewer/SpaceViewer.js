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
  height: 200px;
`

const SpaceViewer = ({ facetDataUrl }) => {
  const [facet, setFacet] = React.useState()
  const [chemicals, setChemicals] = React.useState()
  const [selectedChem, setSelectedChem] = React.useState(-1)

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
        <SpaceScene facet={facet} chemicals={chemicals} />
        <ChemList
          chemicals={chemicals}
          selectedChem={selectedChem}
          setSelectedChem={setSelectedChem}
        />
      </TopPane>
      <BottomPane>
        <ChemDetails chem={chemicals && chemicals[selectedChem]} />
      </BottomPane>
    </Container>
  )
}

export default SpaceViewer
