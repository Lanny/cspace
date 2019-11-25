import React from 'react'

const ChemList = ({ chemicals }) => {
  if (!chemicals || chemicals.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <ol>
      {
        chemicals.map((chem,idx) => (
          <li key={idx}>{chem.name}</li>
        ))
      }
    </ol>
  )
}

export default ChemList
