export type UserPrivate = {
  id: string;
  username: string;
  profilePicture: string | null;

  email: string;

  listeningData: {
    type: 'expanded-history';
    startingDate: Date;
    endingDate: Date;
  }[];
};

export type UserPublic = {
  id: string;
  username: string;
  profilePicture: string | null;
};
