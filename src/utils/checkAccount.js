
function checkAddressInUsers(address, edges) {
  for (const edge of edges) {
    if (edge.node.address === address) {
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

function checkAddressInAdmins(address, edges) {
  for (const edge of edges) {
    if (edge.node.admin.address === address) {
      return true
    }
  }
  return false
}

async function checkAccount(getUsers, address, users) {
  const firstCheck = checkAddressInUsers(address, users.edges);
  if (!firstCheck.exists) {
    let newEndCursor = users.pageInfo.endCursor;
    while (newEndCursor !== null) {
      const { endCursor, users } = await getUsers({ cursor: newEndCursor });
      newEndCursor = endCursor;
      const secondCheck = checkAddressInUsers(address, users);
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
  checkAddressInAdmins,
  checkAccount
}