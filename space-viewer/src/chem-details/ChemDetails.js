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
  box-sizeing: border-box;
`

const ChemicalName = styled.h2`
  border-bottom: 1px solid black;
  margin: 0;
  margin-bottom: 5px;
  padding: 10px 10px 5px 10px;
`

const Details = styled.div`
  display: flex;
`

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Field = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`

const FieldLabel = styled.span`
  border-bottom: 1px solid #CAC7C7;
  padding: 5px;
  margin-bottom: 5px;
`

const FieldContent = styled.div`
  padding-left: 5px;
`

const PanToButton = styled.button`
  margin-left: 10px;
`

const ChemDetails = ({ chem, setPannedChem }) => {
  const [svgData, setSvgData] = React.useState('')

  React.useEffect(() => {
    if (!chem)
      return

    fetch(chem.svg_url)
      .then(res => res.json())
      .then(res => {
        setSvgData(res.data)
      })
  }, [chem && chem.chem_id])

  if (!chem) {
    return (
      <Placeholder>
        <span>Select a Chemical to View Details</span>
      </Placeholder>
    )
  }

  return (
    <Container>
      <ChemicalName>
        { chem.name }
        <PanToButton onClick={() => setPannedChem({ chem_id: chem.chem_id })}>
          Pan To
        </PanToButton>
      </ChemicalName>
      <Details>
        <img src={`data:image/svg+xml;charset=utf-8;base64,${btoa(svgData)}`} />
        <FieldsContainer>
          <Field>
            <FieldLabel>Molecular Weight</FieldLabel>
            <FieldContent>{ chem.mol_weight }</FieldContent>
          </Field>
          <Field>
            <FieldLabel>SMILES</FieldLabel>
            <FieldContent>{ chem.smiles }</FieldContent>
          </Field>
        </FieldsContainer>
      </Details>
    </Container>
  )
}

export default ChemDetails
