import { CategoryFragment } from "./constants"

export default function getCategoryID(client, category) {
  const result = client.readFragment({
    id: client.cache.identify({ __typename: "Category", name: category }),
    fragment: CategoryFragment
  })
  return result.id
}