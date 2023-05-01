import gql from "graphql-tag"

export const pageSizeSmall = 50
export const pageSizeMedium = 100
export const pageSizeLarge = 400
export const pageSizeMax = 1000

export const websiteDataQueryParams = {
  pageSizeMedium,
  pageSizeMax
}

export const GET_WEBSITE_DATA = gql`
  query WebsiteData($id: ID!, $pageSizeMedium: Int!) {
    node(id: $id) {
      ... on Website {
        id
        admins(first: $pageSizeMedium) {
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
        pins(first: $pageSizeMedium) {
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
                  artistNames
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
              likes(first: $pageSizeMedium) {
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
              dislikes(first: $pageSizeMedium) {
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
        subscriptions(first: $pageSizeMedium) {
          edges {
            node {
              id
              subscribedID
              subscribedWebsite {
                id
                websiteName
                description
                image
                pins(first: $pageSizeMedium) {
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
                          artistNames
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
                      likes(first: $pageSizeMedium) {
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
                      dislikes(first: $pageSizeMedium) {
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
        users(first: $pageSizeMedium) {
          edges {
            node {
              id
              address
              ensName
              pins(first: $pageSizeMedium) {
                edges {
                  node {
                    id
                  }
                }
              }
              pinsCount
              pinLikes(first: $pageSizeMedium) {
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
              pinDislikes(first: $pageSizeMedium) {
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
        featured(first: $pageSizeMedium) {
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
                    artistNames
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
                likes(first: $pageSizeMedium) {
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
                dislikes(first: $pageSizeMedium) {
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
        categories(first: $pageSizeMedium) {
          edges {
            node {
              id
              name
              pins(first: $pageSizeMedium) {
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
                        artistNames
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
                    likes(first: $pageSizeMedium) {
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
                    dislikes(first: $pageSizeMedium) {
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
              likes(first: $pageSizeMedium) {
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
              dislikes(first: $pageSizeMedium) {
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
    metadata {
      createdAt
      updatedAt
    }
  }
`
export const UserFragment = gql`
  fragment WebsiteUser on EthAccount {
    id
    address
    ensName
    pins(first: $pageSizeMedium) {
      edges {
        node {
          id
        }
      }
    }
    pinsCount
    pinLikes(first: $pageSizeMedium) {
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
    pinDislikes(first: $pageSizeMedium) {
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

export const GET_PINS = gql`
  query GetPins($id: ID!, $pageSizeMedium: Int!, $cursor: String) {
    node(id: $id) {
      ... on Website {
        id
        pins(first: $pageSizeMedium, after: $cursor) {
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
                  artistNames
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
  query GetSubscriptions($id: ID!, $pageSizeMedium: Int!) {
    node(id: $id) {
      ... on Website {
        id
        subscriptions(first: $pageSizeMedium) {
          edges {
            node {
              id
              subscribedID
              subscribedWebsite {
                id
                websiteName
                description
                image
                pins(first: $pageSizeMedium) {
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
                          artistNames
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

export const GET_USERS = gql`
  query GetUsers($id: ID!, $pageSizeMedium: Int!, $cursor: String) {
    node(id: $id) {
      ... on Website {
        id
        users(first: $pageSizeMedium, after: $cursor) {
          pageInfo {
            startCursor
            endCursor
          }
          edges {
            node {
              id
              address
              ensName
              pins(first: $pageSizeMedium) {
                edges {
                  node {
                    id
                  }
                }
              }
              pinsCount
              pinLikes(first: $pageSizeMedium) {
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
              pinDislikes(first: $pageSizeMedium) {
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

export const GET_FEATURED = gql`
  query GetFeatured($id: ID!, $pageSizeMedium: Int!) {
    node(id: $id) {
      ... on Website {
        id
        featured(first: $pageSizeMedium) {
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
                    artistNames
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
                likes(first: $pageSizeMedium) {
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
                dislikes(first: $pageSizeMedium) {
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

export const CREATE_PIECE = gql(`
  mutation CreatePiece($input: CreatePieceInput!) {
    createPiece(input: $input) {
      document {
        id
      }
    }
  }
`)

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
