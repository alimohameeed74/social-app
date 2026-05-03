import { IcommentCreator } from './IcommentCreator.js';

export interface Icomment {
  _id: string;
  content: string;
  image: string;
  commentCreator: IcommentCreator;
  post: string;
  parentComment: any;
  likes: string[];
  createdAt: string;
  repliesCount?: number;
  likesCount?: number;
  isReply?: boolean;
}
