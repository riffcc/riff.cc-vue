import gql from "graphql-tag"

// Fragments

export const UserFragment = gql`
  fragment SiteUser on EthAccount {
    id
    address
    ensName
    settings {
      autoplay
    }
    pins(first: $pageSize) {
      edges {
        node {
          id
        }
      }
    }
    pinsCount
    pinLikes(first: $pageSize) {
      edges {
        node {
          id
          pin {
            id
          }
          owner {
            address
          }
        }
      }
    }
    pinLikesCount
    pinDislikes(first: $pageSize) {
      edges {
        node {
          id
          pin {
            id
          }
          owner {
            address
          }
        }
      }
    }
    pinDislikesCount
    createdAt
    updatedAt
  }
`

export const CategoryFragment = gql`
  fragment Category on Category {
    id
    name
  }
`
export const siteShortFragment = gql`fragment SiteShortFragment on Site {
  id
  name
  description
  image
}`

export const subscriptionFragment = gql`fragment SubscriptionFragment on Subscription {
  id
  siteID
  subscribedID
  subscribedSite {
    ...SiteShortFragment
  }
	inactive
  createdAt
  updatedAt
}
${siteShortFragment}
`
export const pieceFragment = gql`fragment PieceFragment on Piece {
    id
    name
    contentCid
    details {
      IMDBID
      TMDBID
      albumTitle
      bitrate
      format
      initialReleaseYear
      media
      musicBrainzID
      poster
      releaseDescription
      releaseType
      tags
      thumbnailCid
      type
    }
    updatedAt
    createdAt
}`

export const pinFragment = gql`fragment PinFragment on Pin {
    id
    siteID
    owner {
      address
      id
    }
    piece {
      ...PieceFragment
    }
    artist {
      id
      name
    }
    category {
      id
      name
    }
    approved
    deleted
    rejected
    rejectionReason
    likesCount
    dislikesCount
  }
  ${pieceFragment}
`

export const pageInfoFragment = gql`
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`

// Queries

export const GET_WEBSITE = gql`
  query SiteData($id: ID!) {
    node(id: $id) {
      ... on Site {
        id
        name
        image
        description
      }
    }
  }
`;
export const GET_ACCOUNT_SETTINGS = gql`
  query EthAccountSettings($id: ID!) {
    node(id: $id) {
      ... on EthAccount {
        settings {
          autoplay
        }
      }
    }
  }
`;
export const GET_PINS = gql`query PinQueryWithFilter($filters: PinFiltersInput, $items: Int!) {
  pinIndex(filters: $filters, first: $items) {
    pageInfo {
      ...PageInfoFragment
    }
    edges {
      node {
        ...PinFragment
      }
    }
  }}
  ${pinFragment}
  ${pageInfoFragment}
`;

export const GET_FEATUREDS = gql`query FeaturedIndexQuery($items: Int!, $filters: FeaturedFiltersInput!) {
  featuredIndex(first: $items, filters: $filters) {
    edges {
      node {
        id
        pinID
        pin {
          ...PinFragment
        }
        siteID
        startAt
        endAt
      }
    }
  }
}
${pinFragment}
`;
export const GET_CATEGORIES = gql`
  query GetCategories($id: ID!) {
    node(id: $id) {
      ... on Site {
        id
        categories(first: 100) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`;
export const GET_PIN = gql`
  query Pin($id: ID!) {
    node(id: $id) {
      ... on Pin {
      ...PinFragment
      }
    }
  }
  ${pinFragment}
`;
export const GET_PIN_LIKES = gql`
  query Pin($id: ID!, $pageSize: Int!, $cursor: String) {
    node(id: $id) {
      ... on Pin {
        id
        likes(first: $pageSize, after: $cursor) {
          edges {
            node {
              id
              pin {
                id
              }
              owner {
                address
              }
            }
          }
        }
      }
    }
  }
`;
export const GET_SUBSCRIPTIONS = gql`query SubscriptionIndexQuery($items: Int!, $filters: SubscriptionFiltersInput) {
  subscriptionIndex(first: $items, filters: $filters) {
    edges {
      node {
        ...SubscriptionFragment
      }
    }
  }
}
${subscriptionFragment}
`;
export const GET_ETH_ACCOUNT = gql`query EthAccountQuery($filters: EthAccountFiltersInput, $items: Int!) {
    ethAccountIndex(first: $items, filters: $filters) {
      edges {
        node {
          id
          address
          isAdmin
          isSuperAdmin
          createdAt
          updatedAt
        }
      }
    }
  }
`;
export const GET_ARTIST = gql`query GetArtistsWithFilter($filters: ArtistFiltersInput, $items: Int!) {
  artistIndex(filters: $filters, first: $items) {
    edges {
      node {
        id
        name
        pins(first: $items) {
          edges {
            node {
              id
            }
          }
        }
        pinsCount
      }
    }
  }
}
`;

// Mutations

export const CREATE_PIECE = gql`
  mutation CreatePiece($input: CreatePieceInput!) {
    createPiece(input: $input) {
      document {
        id
      }
    }
  }
`;
export const CREATE_ARTIST = gql`
  mutation CreateArtist($input: CreateArtistInput!){
    createArtist(input: $input) {
      document {
        id
      }
    }
  }
`;
export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      document {
        id
        subscribedID
        subscribedSite {
          id
          name
          description
          image
        }
        inactive
        createdAt
        updatedAt
      }
    }
  }
`;
export const UPDATE_SUBSCRIPTION = gql`
  mutation UpdateSubscription($input: UpdateSubscriptionInput!) {
    updateSubscription(input: $input) {
      document {
        id
        subscribedID
        subscribedSite {
          id
          name
          description
          image
        }
        inactive
        createdAt
        updatedAt
      }
    }
  }
`;
export const CREATE_FEATURED = gql`
  mutation CreateFeatured($input: CreateFeaturedInput!) {
    createFeatured(input: $input) {
      document {
        id
      }
    }
  }
`;
export const CREATE_PIN_LIKE = gql`
  mutation CreatePinLike($input: CreatePinLikeInput!) {
    createPinLike(input: $input) {
      document {
        id
        pin {
          id
        }
        owner {
          address
        }
      }
    }
  }
`;
export const CREATE_PIN_DISLIKE = gql`
  mutation CreatePinDislike($input: CreatePinDislikeInput!) {
    createPinDislike(input: $input) {
      document {
        id
        pin {
          id
        }
        owner {
          address
        }
      }
    }
  }
`;
// Config constants

export const pinCategories = [
  'TV Shows',
  'Movies',
  'Audiobooks',
  'Games',
  'Books',
  'Music',
  'Videos',
  'Other',
]

export const releaseTypesOptions = [
  'Album',
  'Soundtrack',
  'EP',
  'Anthology',
  'Compilation',
  'Single',
  'Live Album',
  'Remix',
  'Bootleg',
  'Interview',
  'Mixtape',
  'Demo',
  'Concert Recording',
  'DJ Mix',
  'Unknown',
]

export const formatOptions = [
  'MP3',
  'FLAC',
  'AAC',
  'AC3',
  'DTS'
]

export const mediaOptions = [
  'CD',
  'DVD',
  'Vinyl',
  'Soundboard',
  'SACD',
  'DAT',
  'WEB',
  'Blu-Ray',
]

export const movieTypeOptions = [
  'Feature Film',
  'Short Film',
  'Miniseries',
  'Stand-up Comedy',
  'Live Performance',
  'Movie Collection',
]

export const defaultUserSettings = {
  autoplay: true
}