
function checkArtistInArtists(artistName, edges) {
  for (const edge of edges) {
    if (edge.node.name.toLowerCase() === artistName.toLowerCase()) {
      return {
        exists: true,
        id: edge.node.id
      };
    }
  }
  return {
    exists: false,
    id: null
  };
}

async function checkArtist(getArtists, artistName, artists) {
  const firstCheck = checkArtistInArtists(artistName, artists.edges);
  if (!firstCheck.exists) {
    let newEndCursor = artists.pageInfo.endCursor;
    while (newEndCursor !== null) {
      const { data } = await getArtists({ cursor: newEndCursor });
      newEndCursor = data.artistIndex.pageInfo.endCursor;
      const secondCheck = checkArtistInArtists(artistName, data.artistIndex.edges);
      if (secondCheck.exists) {
        return secondCheck.id
      }
    }
    if (newEndCursor === null) {
      return null
    }
  } else {
    return firstCheck.id
  }
}

export {
  checkArtist
}