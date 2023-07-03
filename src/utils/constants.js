import gql from "graphql-tag"

export const pageSizeSmall = 50
export const pageSizeMedium = 100
export const pageSizeLarge = 400
export const pageSizeMax = 1000

export const websiteDataQueryParams = {
  pageSizeMedium,
  pageSizeMax
}
export const GET_WEBSITE = gql`
  query WebsiteData($id: ID!) {
    node(id: $id) {
      ... on Website {
        id
        websiteName
        image
        description
      }
    }
  }
`

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
`

export const CREATE_ARTIST = gql`
  mutation CreateArtist($input: CreateArtistInput!){
    createArtist(input: $input) {
      document {
        id
      }
    }
  }
`
export const GET_WEBSITE_DATA = gql`
  query WebsiteData($id: ID!, $pageSize: Int!) {
    node(id: $id) {
      ... on Website {
        id
        admins(first: $pageSize) {
          edges {
            node {
              id
              adminID
              admin {
                address
                ensName
              }
              super
              inactive
              metadata {
                createdAt
                updatedAt
              }
            }
          }
        }
        adminsCount
        pins(first: $pageSize) {
          edges {
            node {
              id
              website {
                id
              }
              owner {
                id
                address
              }
              category {
                id
                name
              }
              artistID
              artist {
                name
              }
              piece {
                id
                CID
                name
                details {
                  tags
                  type
                  media
                  IMDBID
                  TMDBID
                  format
                  poster
                  bitrate
                  albumTitle
                  releaseType
                  musicBrainzID
                  imageThumbnailCID
                  initialReleaseYear
                  releaseDescription
                }
                metadata {
                  createdAt
                  updatedAt
                }
              }
              approved
              rejected
              rejectionReason
              deleted
              likesCount
              likes(first: $pageSize) {
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
              dislikesCount
              dislikes(first: $pageSize) {
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
        pinsCount
        subscriptions(first: $pageSize) {
          edges {
            node {
              id
              subscribedID
              subscribedWebsite {
                id
                websiteName
                description
                image
                pins(first: $pageSize) {
                  edges {
                    node {
                      id
                      website {
                        id
                      }
                      owner {
                        id
                        address
                      }
                      category {
                        id
                        name
                      }
                      artistID
                      artist {
                        name
                      }
                      piece {
                        id
                        CID
                        name
                        details {
                          tags
                          type
                          media
                          IMDBID
                          TMDBID
                          format
                          poster
                          bitrate
                          albumTitle
                          releaseType
                          musicBrainzID
                          imageThumbnailCID
                          initialReleaseYear
                          releaseDescription
                        }
                        metadata {
                          createdAt
                          updatedAt
                        }
                      }
                      approved
                      rejected
                      rejectionReason
                      deleted
                      likesCount
                      likes(first: $pageSize) {
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
                      dislikesCount
                      dislikes(first: $pageSize) {
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
                pinsCount
              }
              inactive
              metadata {
                createdAt
                updatedAt
              }
            }
          }
        }
        subscriptionsCount
        users(first: $pageSize) {
          edges {
            node {
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
              metadata {
                createdAt
                updatedAt
              }
            }
          }
        }
        usersCount
        featured(first: $pageSize) {
          edges {
            node {
              id
              pin {
                id
                website {
                  id
                }
                owner {
                  id
                  address
                }
                category {
                  id
                  name
                }
                artistID
                artist {
                  name
                }
                piece {
                  id
                  CID
                  name
                  details {
                    tags
                    type
                    media
                    IMDBID
                    TMDBID
                    format
                    poster
                    bitrate
                    albumTitle
                    releaseType
                    musicBrainzID
                    imageThumbnailCID
                    initialReleaseYear
                    releaseDescription
                  }
                  metadata {
                    createdAt
                    updatedAt
                  }
                }
                approved
                rejected
                rejectionReason
                deleted
                likesCount
                likes(first: $pageSize) {
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
                dislikesCount
                dislikes(first: $pageSize) {
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
              startAt
              endAt
            }
          }
        }
        featuredCount
        categories(first: $pageSize) {
          edges {
            node {
              id
              name
              pins(first: $pageSize) {
                edges {
                  node {
                    id
                    website {
                      id
                    }
                    owner {
                      id
                      address
                    }
                    category {
                      id
                      name
                    }
                    artistID
                    artist {
                      name
                    }
                    piece {
                      id
                      CID
                      name
                      details {
                        tags
                        type
                        media
                        IMDBID
                        TMDBID
                        format
                        poster
                        bitrate
                        albumTitle
                        releaseType
                        musicBrainzID
                        imageThumbnailCID
                        initialReleaseYear
                        releaseDescription
                      }
                      metadata {
                        createdAt
                        updatedAt
                      }
                    }
                    approved
                    rejected
                    rejectionReason
                    deleted
                    likesCount
                    likes(first: $pageSize) {
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
                    dislikesCount
                    dislikes(first: $pageSize) {
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
              pinsCount
              likesCount
              likes(first: $pageSize) {
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
              dislikesCount
              dislikes(first: $pageSize) {
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
        categoriesCount
      }
    }
  }
`
export const AdminFragment = gql`
  fragment WebsiteAdmin on Admin {
    id
    adminID
    admin {
      address
      ensName
    }
    super
    inactive
  }
`
export const UserFragment = gql`
  fragment WebsiteUser on EthAccount {
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
    metadata {
      createdAt
      updatedAt
    }
  }
`
export const CategoryFragment = gql`
  fragment Category on Category {
    id
    name
  }
`
export const SubscriptionFragment = gql`
  fragment SubscriptionFragment on Subscription {
    id
    subscribedID
    subscribedWebsite {
      id
    }
    inactive
    metadata {
      createdAt
      updatedAt
    }
  }
`
export const PinFragment = gql`
  fragment Pin on Pin {
    id
  }
`
export const GET_PINS = gql`
  query GetPins($id: ID!, $pageSize: Int!, $cursor: String) {
    node(id: $id) {
      ... on Website {
        id
        pins(first: $pageSize, after: $cursor) {
          pageInfo {
            startCursor
            endCursor
          }
          edges {
            node {
              id
              website {
                id
              }
              owner {
                id
                address
              }
              category {
                id
                name
              }
              artistID
              artist {
                name
                pins(first: $pageSize) {
                  edges {
                    node {
                      piece {
                        name
                        CID
                        details {
                          imageThumbnailCID
                        }
                      }
                    }
                  }
                }
              }
              piece {
                id
                CID
                name
                details {
                  tags
                  type
                  media
                  IMDBID
                  TMDBID
                  format
                  poster
                  bitrate
                  albumTitle
                  releaseType
                  musicBrainzID
                  imageThumbnailCID
                  initialReleaseYear
                  releaseDescription
                }
                metadata {
                  createdAt
                  updatedAt
                }
              }
              approved
              rejected
              rejectionReason
              deleted
              likesCount
              dislikesCount
            }
          }
        }
        pinsCount
      }
    }
  }
`;

export const GET_SUBSCRIPTIONS = gql`
  query GetSubscriptions($id: ID!, $pageSize: Int!) {
    node(id: $id) {
      ... on Website {
        id
        subscriptions(first: $pageSize) {
          edges {
            node {
              id
              subscribedID
              subscribedWebsite {
                id
                websiteName
                description
                image
                pins(first: $pageSize) {
                  edges {
                    node {
                      id
                      website {
                        id
                      }
                      owner {
                        id
                        address
                      }
                      category {
                        id
                        name
                      }
                      artistID
                      artist {
                        name
                      }
                      piece {
                        id
                        CID
                        name
                        details {
                          tags
                          type
                          media
                          IMDBID
                          TMDBID
                          format
                          poster
                          bitrate
                          albumTitle
                          releaseType
                          musicBrainzID
                          imageThumbnailCID
                          initialReleaseYear
                          releaseDescription
                        }
                        metadata {
                          createdAt
                          updatedAt
                        }
                      }
                      approved
                      rejected
                      rejectionReason
                      deleted
                      likesCount
                      dislikesCount
                    }
                  }
                }
                pinsCount
              }
              inactive
              metadata {
                createdAt
                updatedAt
              }
            }
          }
        }
        subscriptionsCount
      }
    }
  }
`;

export const GET_FEATURED = gql`
  query GetFeatured($id: ID!, $pageSize: Int!) {
    node(id: $id) {
      ... on Website {
        id
        featured(first: $pageSize) {
          edges {
            node {
              id
              pin {
                id
                website {
                  id
                }
                owner {
                  id
                  address
                }
                category {
                  id
                  name
                }
                artistID
                artist {
                  name
                }
                piece {
                  id
                  CID
                  name
                  details {
                    tags
                    type
                    media
                    IMDBID
                    TMDBID
                    format
                    poster
                    bitrate
                    albumTitle
                    releaseType
                    musicBrainzID
                    imageThumbnailCID
                    initialReleaseYear
                    releaseDescription
                  }
                  metadata {
                    createdAt
                    updatedAt
                  }
                }
                approved
                rejected
                rejectionReason
                deleted
                likesCount
                likes(first: $pageSize) {
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
                dislikesCount
                dislikes(first: $pageSize) {
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
              startAt
              endAt
            }
          }
        }
        featuredCount
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories($id: ID!, $pageSize: Int!) {
    node(id: $id) {
      ... on Website {
        id
        categories(first: $pageSize) {
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
  query Pin($id: ID!, $pageSize: Int!) {
    node(id: $id) {
      ... on Pin {
        id
        website {
          id
        }
        owner {
          id
          address
        }
        category {
          id
          name
        }
        artistID
        artist {
          name
          pins(first: $pageSize) {
            edges {
              node {
                id
                piece {
                  name
                  CID
                  details {
                    imageThumbnailCID
                  }
                }
              }
            }
          }
        }
        piece {
          id
          CID
          name
          details {
            tags
            type
            media
            IMDBID
            TMDBID
            format
            poster
            bitrate
            albumTitle
            releaseType
            musicBrainzID
            imageThumbnailCID
            initialReleaseYear
            releaseDescription
          }
          metadata {
            createdAt
            updatedAt
          }
        }
        approved
        rejected
        rejectionReason
        deleted
        likesCount
        likes(first: $pageSize) {
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
        dislikesCount
        dislikes(first: $pageSize) {
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
`

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
`

export const GET_SUBSCRIPTION_INDEX = gql`
  query SubscriptionIndex($pageSize: Int!) {
    subscriptionIndex(first: $pageSize) {
      pageInfo {
        startCursor
        endCursor
      }
      edges {
        node {
          id
          subscribedID
          subscribedWebsite {
            id
            websiteName
            description
            image
          }
          inactive
          metadata {
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`

export const CREATE_PIECE = gql`
  mutation CreatePiece($input: CreatePieceInput!) {
    createPiece(input: $input) {
      document {
        id
      }
    }
  }
`

export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      document {
        id
        subscribedID
        subscribedWebsite {
          id
          websiteName
          description
          image
        }
        inactive
        metadata {
          createdAt
          updatedAt
        }
      }
    }
  }
`

export const UPDATE_SUBSCRIPTION = gql`
  mutation UpdateSubscription($input: UpdateSubscriptionInput!) {
    updateSubscription(input: $input) {
      document {
        id
        subscribedID
        subscribedWebsite {
          id
          websiteName
          description
          image
        }
        inactive
        metadata {
          createdAt
          updatedAt
        }
      }
    }
  }
`


export const GET_USERS = gql`
  query GetUsers($id: ID!, $pageSize: Int!, $cursor: String) {
    node(id: $id) {
      ... on Website {
        id
        users(first: $pageSize, after: $cursor) {
          pageInfo {
            startCursor
            endCursor
          }
          edges {
            node {
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
              metadata {
                createdAt
                updatedAt
              }
            }
          }
        }
        usersCount
      }
    }
  }
`;
export const GET_ARTISTS = gql`
  query GetArtists($pageSize: Int!, $cursor: String) {
    artistIndex(first: $pageSize, after: $cursor) {
      pageInfo {
        startCursor
        endCursor
      }
      edges {
        node {
          id
          name
          pins(first: $pageSize) {
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
export const GET_ADMINS = gql`
  query GetAdmins($id: ID!, $pageSize: Int!) {
    node(id: $id) {
      ... on Website {
        id
        admins(first: $pageSize) {
          edges {
            node {
              id
              adminID
              admin {
                address
                ensName
              }
              super
              inactive
              metadata {
                createdAt
                updatedAt
              }
            }
          }
        }
        adminsCount
      }
    }
  }
`;

export const CREATE_ETH_ACCOUNT = gql`
  mutation CreateEthAccount($input: CreateEthAccountInput!) {
    createEthAccount(input: $input) {
      document {
        id
      }
    }
  }
`

export const CREATE_ADMIN = gql`
  mutation CreateAdmin($input: CreateAdminInput!) {
    createAdmin(input: $input) {
      document {
        id
        adminID
        admin {
          address
          ensName
        }
        super
        inactive
        metadata {
          createdAt
          updatedAt
        }
      }
    }
  }
`

export const UPDATE_ADMIN = gql`
  mutation UpdateaAdmin($input: UpdateAdminInput!) {
    updateAdmin(input: $input) {
      document {
        id
        adminID
        admin {
          address
          ensName
        }
        super
        inactive
        metadata {
          createdAt
          updatedAt
        }
      }
    }
  }
`

export const GET_USER_LIKES_AND_DISLIKES = gql`
  query Account($id: ID!, $pageSize: Int!) {
      node(id: $id) {
        ... on EthAccount {
          id
          address
          pinLikes(first: $pageSize) {
            pageInfo {
              startCursor
              endCursor
              hasNextPage
              hasPreviousPage
            }
            edges {
              node {
                pinID
              }
            }
          }
          pinDislikes(first: $pageSize) {
            pageInfo {
              startCursor
              endCursor
              hasNextPage
              hasPreviousPage
            }
            edges {
              node {
                pinID
              }
            }
          }
        }
    }
  }
`


export const CREATE_FEATURED = gql`
  mutation CreateFeatured($input: CreateFeaturedInput!) {
    createFeatured(input: $input) {
      document {
        id
      }
    }
  }
`

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
`

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
`

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

export const formatOptions = ['MP3', 'FLAC', 'AAC', 'AC3', 'DTS']

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
