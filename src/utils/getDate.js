export const getDate = (f) => {
  const date = new Date
  if (f === 'iso') {
    return date.toISOString().substring(0, 16)
  } else if (f === 'isows') {
    return date.toISOString()
  } else if (f === 'number') {
    return Date.now()
  } else {
    return date.toString()
  }
}