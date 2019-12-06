import React from 'react'

const ChemFormula = ({ formula }) => (
  <span>
    {
      formula.split(/(\d+)/).map((part, idx) => {
        const El = part.match(/\d+/) ? 'sub' : 'span'
        return <El key={idx}>{part}</El>
      })
    }
  </span>
)

export default ChemFormula
