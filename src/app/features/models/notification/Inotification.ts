import { Iactor } from '../notification-actor/Iactor.js';
import { Ientity } from '../notification-entity/Ientity.js';
import { Irecipient } from '../notification-recipient/Irecipient.js';

export interface Inotification {
  _id: string;
  recipient: Irecipient;
  actor: Iactor;
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  entity: Ientity;
}
