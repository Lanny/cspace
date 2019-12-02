import React from 'react'
import styled from 'styled-components'

import { getColor, cssifyColor } from '../space-scene/support/utils'

const TagColor = styled.div`
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1px solid black;
  background-color: ${props => cssifyColor(props.color)};
  margin-right: 5px;
  vertical-align: middle;
`

const TagSymbol = ({ allTags, tags, showLabel = false }) => {
  const color = getColor(allTags, tags)

  return (
    <div>
      <TagColor color={color} />
      { showLabel && <span>{ tags.join('/') }</span> }
    </div>
  )
}

export default TagSymbol
