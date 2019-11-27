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

const NameCell = styled.td`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const WeightCell = styled.td`
  width: 3em;
  text-align: right;
`

const ChemRow = ({ chemical }) => {
  return (
    <tr>
      <NameCell>{chemical.name}</NameCell>
      <WeightCell>{chemical.mol_weight.toFixed(1)}</WeightCell>
    </tr>
  )
}

const ChemList = ({ chemicals }) => {
  if (!chemicals || chemicals.length === 0) {
    return <div>Loading...</div>
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
            chemicals.map(chem => <ChemRow chemical={chem} key={chem.pk} />)
          }
        </tbody>
      </Table>
    </TableContainer>
  )
}

export default ChemList
