
import { ComposeClient } from '@composedb/client';
import { definition } from './definitions';

export default function createComposeClient(ceramic) {
  return new ComposeClient({
    ceramic: ceramic,
    definition,
  });
}