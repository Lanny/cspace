import React from 'react'
import styled from 'styled-components'

const Placeholder = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
  width: 100%
  height: 100%;
`

const ChemicalName = styled.h2`
  border-bottom: 1px solid black;
  margin-bottom: 5px;
  padding: 10px 10px 5px 10px;
`

const ChemDetails = ({ chem }) => {
  if (!chem) {
    return (
      <Placeholder>
        <span>Select a Chemical to View Details</span>
      </Placeholder>
    )
  }

  return (
    <Container>
      <ChemicalName>{ chem.name }</ChemicalName>
    </Container>
  )
}

export default ChemDetails
