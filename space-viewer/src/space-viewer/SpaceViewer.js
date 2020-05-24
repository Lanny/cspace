import React from 'react'
import styled from 'styled-components'

import Search from '../search/Search'
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
  height: calc(100vh - 250px);
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
  const [searchQuery, setSearchQuery] = React.useState('')

  const editSMILES = SMILES =>  {
    return new Promise(res => {
      const url = `${window.CSpace.chemEditorUrl}?SMILES=${encodeURIComponent(SMILES)}`
      const editorHandle = window.open(url)
      window.addEventListener('message', message => {
        editorHandle.close()
        res(message.data.SMILES)
      })
    })
  }

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
        <Search
          facet={facet}
          chemicals={chemicals}
          selectedChem={selectedChem}
          setSelectedChem={setSelectedChem}
          setPannedChem={setPannedChem}
          query={searchQuery}
          setQuery={setSearchQuery}
          editSMILES={editSMILES}
        />
      </TopPane>
      <BottomPane>
        <ChemDetails
          chem={selectedChem}
          setPannedChem={setPannedChem}
          setSearchQuery={setSearchQuery}
          editSMILES={editSMILES}
        />
      </BottomPane>
    </Container>
  )
}

export default SpaceViewer
