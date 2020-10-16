const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    // 这会是一个问题么？最初没有这个photo 答案:：不会
    photo: {
      type: String,
      required: true,
    },
    // 这是一个列表形式。别的都是obj. 这个列表中包含obj.
    likes: [{ type: ObjectId, ref: "User" }],

    comments: [
      {
        text: String,
        postedBy: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],

    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
// 创建条目时的时间

mongoose.model("Post", postSchema);
