import React from 'react'

const ChemList = ({ chemicals }) => {
  return (
    <ol>
      {
        chiemicals.map(chem => (
          <li>{chem.name}</li>
        ))
      }
    </ol>
  )
}

export default ChemList
