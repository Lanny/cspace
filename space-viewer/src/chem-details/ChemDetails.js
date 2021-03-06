import React from 'react'
import styled from 'styled-components'

import ChemFormula from '../chem-formula/ChemFormula'

const Placeholder = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
  width: 100%
  height: 250px;
  box-sizeing: border-box;
  display: flex;
  flex-direction: column;
`

const ChemicalName = styled.h2`
  border-bottom: 1px solid black;
  margin: 0 10px 5px;
  padding: 10px 10px 5px 10px;
`

const Details = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  flex-shrink: 1;
`
const StructureContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-wrap: wrap;
`

const Field = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  margin-right: 15px;
`

const FieldLabel = styled.span`
  border-bottom: 1px solid #CAC7C7;
  padding: 5px;
  margin-bottom: 5px;
`

const FieldContent = styled.div`
  padding-left: 5px;
  word-break: break-all;
`

const PanToButton = styled.button`
  margin-left: 10px;
`

const pubchemUrl = chem => (
  `https://pubchem.ncbi.nlm.nih.gov/compound/${chem.pubchem_cid}`
)

const ChemDetails = ({
  chem,
  setPannedChem,
  setSearchQuery,
  editSMILES,
}) => {
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
        <StructureContainer>
          <img
            src={`data:image/svg+xml;charset=utf-8;base64,${btoa(svgData)}`}
            style={{ width: '250px' }}
          />
          <button
            onClick={e => {
              e.preventDefault()
              editSMILES(chem.smiles).then(setSearchQuery)
            }}
          >
            Edit and Search
          </button>
        </StructureContainer>
        <FieldsContainer>
          { chem.formula &&
            <Field>
              <FieldLabel>Chemical Formula</FieldLabel>
              <FieldContent>
                <ChemFormula formula={chem.formula} />
              </FieldContent>
            </Field>
          }
          <Field>
            <FieldLabel>SMILES</FieldLabel>
            <FieldContent>{ chem.smiles }</FieldContent>
          </Field>
          { chem.pubchem_cid &&
            <Field>
              <FieldLabel>Pubchem CID</FieldLabel>
              <FieldContent>
                <a href={pubchemUrl(chem)}>
                  { chem.pubchem_cid }
                </a>
              </FieldContent>
            </Field>
          }
          <Field>
            <FieldLabel>Molecular Weight</FieldLabel>
            <FieldContent>{ chem.mol_weight }</FieldContent>
          </Field>
          <Field>
            <FieldLabel>Topological Polar Surface Area</FieldLabel>
            <FieldContent>{ chem.tpsa.toFixed(1) }Å<sup>2</sup></FieldContent>
          </Field>
            
        </FieldsContainer>
      </Details>
    </Container>
  )
}

export default ChemDetails
