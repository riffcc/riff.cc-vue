export default function parseColors(colors, reverse) {
  const parsedColors = {}
  let params
  if(reverse) {
    params = [/-/g, "_"]
  } else {
    params = [/_/g, "-"]

  }
  Object.entries(colors).forEach(([key, value]) => {
    if (!key || !value || key === '__typename') return
    const keyFormatted = key.replace(...params)
    parsedColors[keyFormatted] = value
  })
  return parsedColors
}