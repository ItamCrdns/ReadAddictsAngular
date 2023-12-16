interface Image {
  image_Id: number;
  post_Id: number;
  user_Id: number;
  image_Url: string;
}

interface Group {
  group_Id: number;
  group_Name: string;
  group_Description: string;
  group_Owner: number;
  group_Picture: string;
}

export interface Post {
  post_Id: number;
  user_Id: number;
  author: string;
  created: string;
  modified: string;
  content: string;
  profile_Picture: string;
  first_Name: string;
  last_Name: string;
  comments: number;
  group_Id: number;
  images: Image[];
  group: Group;
  allowed: boolean;
}
