const colorMap = [
  [0,114,189],
  [217,83,25],
  [237,177,32],
  [126,47,142],
  [119,172,48],
  [77,190,238],
  [162,20,47]
]

export const getColor = (allTags, chemTags) => {
  const color = [0, 0, 0]

  for (let i = 0; i<chemTags.length; i++) {
    const idx = allTags.indexOf(chemTags[i])
    color[0] += colorMap[idx][0]
    color[1] += colorMap[idx][1]
    color[2] += colorMap[idx][2]
  }

  color[0] = Math.round(color[0] / chemTags.length)
  color[1] = Math.round(color[1] / chemTags.length)
  color[2] = Math.round(color[2] / chemTags.length)

  return color
}

export const packColor = color => (color[0] << 16) | (color[1] << 8) | color[2]

export const cssifyColor = color => `rgb(${color[0]},${color[1]},${color[2]})`

