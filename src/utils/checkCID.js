import * as isIPFS from 'is-ipfs'

export default function checkCID(hash) {
  return isIPFS.cid(hash)
}