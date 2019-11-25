import React from 'react'

import ChemList from '../chem-list/ChemList'

const SpaceViewer = ({ facetDataUrl }) => {
  const [facet, setFacet] = React.useState()
  const [chemicals, setChemicals] = React.useState()

  React.useEffect(() => {
    fetch(CSpace.facetDataUrl)
      .then(res => res.json())
      .then(res => {
        setFacet(res.facet)
        setChemicals(res.points)
      })
  }, [])

  return (
    <div>
      <ChemList chemicals={chemicals} />
    </div>
  )
}

export default SpaceViewer
