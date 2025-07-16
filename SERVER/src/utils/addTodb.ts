import User from "../models/User";

export async function createdummyData() {
  try {
    const existingUser = await User.findOne({ username: "dummyUser" });
    if (existingUser) {
      console.log("Dummy user already exists");
      return;
    }

    const dummyUser = new User({
      username: "dummyUser",
      email: "dummyUser@example.com",
      password: "dummyPassword",
      listOfGifts: [
        {
          giftName: "Sample Gift",
          giftLink: "https://example.com/sample-gift",
          giftImage: "https://example.com/sample-gift-image.jpg",
          giftPrice: 19.99,
          giftDescription: "This is a sample gift description.",
        },
      ],
    });
    await dummyUser.save();
    console.log("Dummy user created");
  } catch (error) {
    console.error("Error creating dummy user:", error);
  }
}

export async function addGift() {
  try {
    const userToAdd = await User.findOne({ username: "dummyUser" });
    if (!userToAdd) {
      console.error("User not found");
      return;
    }
    const newGift = {
      giftName: "New Gift",
      giftLink: "https://example.com/new-gift",
      giftImage: "https://example.com/new-gift-image.jpg",
      giftPrice: 29.99,
      giftDescription: "This is a new gift description.",
    };
    userToAdd.listOfGifts?.push(newGift);
    await userToAdd.save();
    console.log("New gift added");
  } catch (error) {
    console.error("Error adding gift:", error);
  }
}
