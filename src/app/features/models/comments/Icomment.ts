import { IcommentCreator } from './IcommentCreator.js';

export interface Icomment {
  _id: string;
  content: string;
  commentCreator: IcommentCreator;
  post: string;
  parentComment: any;
  likes: any[];
  createdAt: string;
}
