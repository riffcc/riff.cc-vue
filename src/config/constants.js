import gql from "graphql-tag"

// Fragments

export const userFragment = gql`
  fragment UserFragment on EthAccount {
    id
    address
    siteID
    isAdmin
    isSuperAdmin
    settings {
      autoplay
      cidAvatar
    }
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
export const siteColorsFragment = gql`fragment SiteColorsFragment on SiteColors {
  background
  background_lighten_1
    background_lighten_2
  background_darken_1
    background_darken_2
  primary
  primary_lighten_1
  primary_darken_1
  secondary
  secondary_lighten_1
  secondary_darken_1
  surface
  error
  info
  success
  warning
}`
export const siteShortFragment = gql`fragment SiteShortFragment on Site {
  id
  name
  description
  image
  colors {
    ...SiteColorsFragment
  }
  featuredCategories {
    name
  }
}
${siteColorsFragment}
`

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

export const GET_SITE = gql`query SiteQuery($id: ID!) {
    node(id: $id) {
      ... on Site {
        ...SiteShortFragment
      }
    }
  }
  ${siteShortFragment}
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
export const GET_PINS = gql`query PinQueryWithFilter($filters: PinFiltersInput, $items: Int!, $before: String, $after: String) {
  pinIndex(filters: $filters, first: $items, before: $before, after: $after) {
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

export const GET_FEATUREDS = gql`query FeaturedIndexQuery($items: Int!, $filters: FeaturedFiltersInput!, $before: String, $after: String) {
  featuredIndex(first: $items, filters: $filters, before: $before, after: $after) {
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
          ...UserFragment
        }
      }
    }
  }
  ${userFragment}
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
  'TV',
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
  autoplay: true,
  cidAvatar: undefined
}

export const defaultThemeVariables = {
  "border-color": "#A020F0",
  "border-opacity": 0.5,
  "high-emphasis-opacity": 0.87,
  "medium-emphasis-opacity": 0.6,
  "disabled-opacity": 0.38,
  "idle-opacity": 0.04,
  "hover-opacity": 0.04,
  "focus-opacity": 0.12,
  "selected-opacity": 0.08,
  "activated-opacity": 0.12,
  "pressed-opacity": 0.12,
  "dragged-opacity": 0.08,
  "theme-kbd": "#212529",
  "theme-on-kbd": "#FFFFFF",
  "theme-code": "#F5F5F5",
  "theme-on-code": "#000000"
}

export const defaultThemeColors = {
  "background": "#221F1F",
  "background-lighten-1": "#141414",
  "background-lighten-2": "#363B65",
  "background-darken-1": "#191919",
  "background-darken-2": "#191919",
  "primary": "#A020F0",
  "primary-lighten-1": "#BA52FB",
  "primary-darken-1": "#7918B5",
  "secondary": "#D027C1",
  "secondary-lighten-1": "#F24BE3",
  "secondary-darken-1": "#AD18A0",
  "surface": "#299BDD",
  "error": "#F44336",
  "info": "#2986CC",
  "success": "#51BF32",
  "warning": "#F1C232"
}

export const cookiePolicyParaphs = [
  {
    'title': "What are cookies?",
    'content': "This Cookie Policy explains what cookies are and how we use them, the types of cookies we use i.e, the information we collect using cookies and how that information is used, and how to manage the cookie settings. \n\n Cookies are small text files that are used to store small pieces of information.They are stored on your device when the website is loaded on your browser.These cookies help us make the website function properly, make it more secure, provide better user experience, and understand how the website performs and to analyze what works and where it needs improvement."
  },
  {
    'title': "How do we use cookies?",
    'content': "As most of the online services, our website uses first-party and third-party cookies for several purposes. First-party cookies are mostly necessary for the website to function the right way, and they do not collect any of your personally identifiable data. \n\n The third- party cookies used on our website are mainly for understanding how the website performs, how you interact with our website, keeping our services secure, providing advertisements that are relevant to you, and all in all providing you with a better and improved user experience and help speed up your future interactions with our website."
  }
]

export const IPFS_GATEWAY = "riff-cc.infura-ipfs.io"
export const INFURA_API_URL = "ipfs.infura.io:5001"
export const INFURA_API_KEY = "2PHmkli89OL1F5wbEkefZzuMxKs"
export const INFURA_API_KEY_SECRET = "ca8a3794a3f357165579d33ce71cb3b2"
export const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFjQjQ1MGVmODBGNEU3QTI4NDExODUyMjg0ODY1NTg2MjE2ZTRiMTkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5NTczNzE3MzIyOCwibmFtZSI6InJpZmYuY2MifQ.GRA9AwSkkgx9Odz1-_HgHCnzgXCd7tIligKc36ABCUQ"