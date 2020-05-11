import React from 'react'
import styled from 'styled-components'

import TagSymbol from '../tag-symbol/TagSymbol'
import ChemList from '../chem-list/ChemList'
import SearchIcon from '../icons/SearchIcon'
import EditIcon from '../icons/EditIcon'

const Container = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`

const QueryContainer = styled.form`
  width: 100%;
  display: flex;
`

const Query = styled.input`
  flex: 1;
`

const IconButton = styled.button`
  -webkit-appearance: none;
  cursor: pointer;
  padding: 5px;
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
  }, [chemicals, results])

  const onQueryChange = e => setQuery(e.target.value)
  const onQuerySubmit = e => {
    e.preventDefault()
    setLoadingState(true)

    fetch(`${window.CSpace.searchUrl}?SMILES=${encodeURIComponent(query)}`)
      .then(resp => resp.json())
      .then(({ results }) => {
        setResults(results)
        setLoadingState(false)
      })
  }

  window.sq = setQuery
  const onEditQuery = e => {
    e.preventDefault()
    const url = `${window.CSpace.chemEditorUrl}?SMILES=${encodeURIComponent(query)}`
    const editorHandle = window.open(url)
    window.addEventListener('message', message => {
      setQuery(message.data.SMILES)
      editorHandle.close()
    })
  }

  return (
    <Container>
      <QueryContainer action="#" onSubmit={onQuerySubmit}>
        <Query
          type="text"
          placeholder="SMILES query..."
          value={query}
          onChange={onQueryChange}
        />
        <IconButton onClick={onEditQuery}>
          <EditIcon size="12px"/>
        </IconButton>
        <IconButton>
          <SearchIcon size="12px"/>
        </IconButton>
      </QueryContainer>
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

