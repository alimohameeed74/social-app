import { IcommentCreator } from './IcommentCreator.js';

export interface IlikeCommentResponse {
  liked: boolean;
  likesCount: number;
  comment: Comment;
}

export interface Comment {
  _id: string;
  content: string;
  commentCreator: IcommentCreator;
  post: string;
  parentComment: any;
  likes: string[];
  createdAt: string;
  likesCount: number;
  isReply: boolean;
  id: string;
}
