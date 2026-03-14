export interface Ientity {
  _id: string;
  body: string;
  user: string;
  commentsCount: number;
  topComment: any;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  post?: string;
}
