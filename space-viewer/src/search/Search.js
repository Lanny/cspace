import React from 'react'
import styled from 'styled-components'

import TagSymbol from '../tag-symbol/TagSymbol'
import ChemList from '../chem-list/ChemList'

const Container = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`

const Query = styled.input`
  width: 100%;
`
const Search = ({
  chemicals,
  facet,
  selectedChem,
  setPannedChem,
  setSelectedChem
}) => {
  const [results, setResults] = React.useState(null)
  const [query, setQuery] = React.useState('')
  const [loadingState, setLoadingState] = React.useState(false)
  const [filteredChems, setFilteredChems] = React.useState([])

  React.useEffect(() => {
    setFilteredChems((results !== null) ?
      chemicals.filter(({ chem_id }) => chem_id in results) :
      chemicals)
  }, [chemicals, results]);

  const onQueryChange = e => setQuery(e.target.value)
  const onQuerySubmit = e => {
    e.preventDefault()
    setLoadingState(true)

    fetch(`/facet/${facet.id}/search?SMILES=${encodeURIComponent(query)}`)
      .then(resp => resp.json())
      .then(({ results }) => {
        setResults(results)
        setLoadingState(false)
      })
  }

  return (
    <Container>
      <form action="#" onSubmit={onQuerySubmit}>
        <Query
          type="text"
          placeholder="SMILES query..."
          value={query}
          onChange={onQueryChange}
        />
      </form>
      { loadingState ? 
          <div>Loading...</div> :
          (
            <ChemList
              facet={facet}
              chemicals={filteredChems}
              selectedChem={selectedChem}
              setSelectedChem={setSelectedChem}
              setPannedChem={setPannedChem}
            />
          )
      }
    </Container>
  )
}

export default Search

