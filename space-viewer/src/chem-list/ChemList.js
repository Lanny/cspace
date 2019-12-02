import React from 'react'
import styled from 'styled-components'

const TableContainer = styled.div`
  height: 100%;
  overflow-y: scroll;
`

const Table = styled.table`
  width: 100%;
  table-layout: fixed; 
`

const TableHeader = styled.th`
  position: sticky;
  top: -1px;
  background-color: grey;
`

const NameHeader = styled(TableHeader)`
`
const WeigthHeader = styled(TableHeader)`
  width: 3em;
`

const Cell = styled.td`
  background-color: ${({ selected }) => selected ? 'yellow' : 'none'}
  cursor: pointer;
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

const ChemRow = ({ chemical, selected, onClick }) => {
  return (
    <tr onClick={onClick}>
      <NameCell selected={selected}>
        {chemical.name}
      </NameCell>
      <WeightCell selected={selected}>
        {chemical.mol_weight.toFixed(1)}
      </WeightCell>
    </tr>
  )
}

const ChemList = ({
  chemicals,
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
          </tr>
        </thead>
        <tbody>
          {
            chemicals.map((chem, idx) => (
                <ChemRow
                  key={chem.chem_id}
                  chemical={chem}
                  onClick={onRowClick(chem)}
                  selected={selectedChem && selectedChem.chem_id === chem.chem_id}
                />
              )
            )
          }
        </tbody>
      </Table>
    </TableContainer>
  )
}

export default ChemList
