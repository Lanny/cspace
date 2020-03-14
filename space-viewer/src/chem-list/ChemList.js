import React from 'react'
import styled from 'styled-components'

import TagSymbol from '../tag-symbol/TagSymbol'

const TableContainer = styled.div`
  height: 100%;
  overflow-y: scroll;
`

const Table = styled.table`
  width: 100%;
  table-layout: fixed; 
  border-collapse: collapse;
`

const TableHeader = styled.th`
  position: sticky;
  top: -1px;
  background-color: #999999;
`

const NameHeader = styled(TableHeader)`
`
const WeigthHeader = styled(TableHeader)`
  width: 4em;
`
const TagHeader = styled(TableHeader)`
  width: 25px;
`

const Cell = styled.td`
  background-color: ${({ selected }) => selected ? 'yellow' : 'none'}
  cursor: pointer;
  padding: 3px 7px;
  border-bottom: 1px solid lightgray;
`

const NameCell = styled(Cell)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const WeightCell = styled(Cell)`
  width: 3em;
  text-align: right;
`

const TagCell = styled(Cell)`
  width: 3em;
  text-align: right;
`

const ChemRow = ({ chemical, selected, facet, onClick }) => {
  return (
    <tr onClick={onClick}>
      <NameCell selected={selected}>
        {chemical.name}
      </NameCell>
      <WeightCell selected={selected}>
        {chemical.mol_weight.toFixed(1)}
      </WeightCell>
      <TagCell selected={selected}>
        <TagSymbol
          allTags={facet.tags}
          tags={chemical.tags}
          showLabel={false}
        />
      </TagCell>
    </tr>
  )
}

const ChemList = ({
  chemicals,
  facet,
  selectedChem,
  setPannedChem,
  setSelectedChem
}) => {
  if (!chemicals || chemicals.length === 0) {
    return <div>Loading...</div>
  }

  const onRowClick = chem => () => {
    setSelectedChem(chem)
    setPannedChem(chem)
  }

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <NameHeader>
              Name
            </NameHeader>
            <WeigthHeader>
              Wt
            </WeigthHeader>
            <TagHeader>
              Tag
            </TagHeader>
          </tr>
        </thead>
        <tbody>
          {
            chemicals.map((chem, idx) => (
              <ChemRow
                key={chem.chem_id}
                chemical={chem}
                facet={facet}
                onClick={onRowClick(chem)}
                selected={selectedChem && selectedChem.chem_id === chem.chem_id}
              />
            ))
          }
        </tbody>
      </Table>
    </TableContainer>
  )
}

export default React.memo(ChemList)
