
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
    if (edge.node.admin.address === address && !edge.node.admin.inactive) {
      return {
        exist: true,
        id: edge.node.id,
        super: edge.node.super ? true : false
      }
    }
  }
  return {
    exist: false,
    id: null
  }
}

async function checkAccount(getUsers, address, users) {
  const firstCheck = checkAddressInUsers(address, users.edges);
  if (!firstCheck.exists) {
    let newEndCursor = users.pageInfo.endCursor;
    while (newEndCursor !== null) {
      const { data } = await getUsers({ cursor: newEndCursor });
      newEndCursor = data.node.users.pageInfo.endCursor;
      const secondCheck = checkAddressInUsers(address, data.node.users.edges);
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