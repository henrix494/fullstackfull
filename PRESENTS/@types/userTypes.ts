export interface GiftType {
  _id: string;
  giftName: string;
  giftDescription: string;
  giftImage: string;
  giftLink: string;
  giftPrice: number;
}

export interface UserTypes {
  user: {
    __v: number;
    _id: string;
    createdAt: string; // ISO date string
    email: string;
    password: string;
    username: string;
    listOfGifts: GiftType[];
  };
}
