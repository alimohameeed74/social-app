import { Icomment } from '../comments/Icomment.js';
import { Iuser } from '../users/Iuser.js';

export interface Ipost {
  _id: string;
  body: string;
  image: string;
  privacy: string;
  user: Iuser;
  sharedPost: Ipost;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: Icomment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}
