
import { ComposeClient } from '@composedb/client';
import { definition } from '../config/definitions';

export default function createComposeClient(ceramic) {
  return new ComposeClient({
    ceramic: ceramic,
    definition,
  });
}