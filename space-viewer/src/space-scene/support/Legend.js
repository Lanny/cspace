import React from 'react'
import styled from 'styled-components'

import TagSymbol from '../../tag-symbol/TagSymbol'

const LegendContainer = styled.div`
  padding: 5px 10px;
  position: absolute;
  top: 5px; 
  left: 5px;
  background-color: white;
  border: 1px solid black;
`

const LegendList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const LegendItem = styled.li`
`

const Legend = ({ tags }) => (
  <LegendContainer>
    <LegendList>
    { tags.map(tag => (
        <LegendItem key={tag}>
          <TagSymbol allTags={tags} tags={[tag]} showLabel />
        </LegendItem>
      ))
    }
    </LegendList>
  </LegendContainer>
)

export default Legend
