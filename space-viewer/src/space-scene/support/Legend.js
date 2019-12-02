import React from 'react'
import styled from 'styled-components'

import { getColor, cssifyColor } from './utils'

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

const LegendColor = styled.div`
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1px solid black;
  background-color: ${props => cssifyColor(props.color)};
  margin-right: 5px;
  vertical-align: middle;
`

const Legend = ({ tags }) => (
  <LegendContainer>
    <LegendList>
    { tags.map(tag => {
        const color = getColor(tags, [tag])
        return (
          <LegendItem key={tag}>
            <LegendColor color={color} />
            <span>{ tag }</span>
          </LegendItem>
        )
      })
    }
    </LegendList>
  </LegendContainer>
)

export default Legend
