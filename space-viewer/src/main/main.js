import React from 'react'
const ReactDOM = require('react-dom')
 
import ChemList from '../chem-list/ChemList'

const root = document.getElementById('root')
const chemicals = [
  { name: 'xanny bars' },
  { name: 'addy bruh' },
]

ReactDOM.render(<ChemList chemicals={chemicals} />, root);
