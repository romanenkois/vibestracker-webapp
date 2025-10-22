export type UserPrivate = {
  id: string;
  username: string;
  profilePicture: string | null;

  email: string;

  listeningData: {
    expandedHistory: {
      type: 'expanded-history';

      startingDate: Date;
      endingDate: Date;

      totalRecordsNumber: number;
      uniqueTracksNumber: number;

      totalMsPlayed: number;
    };
  };
};

export type UserPublic = {
  id: string;
  username: string;
  profilePicture: string | null;
};
