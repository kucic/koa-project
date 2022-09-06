import mongoose from "mongoose"

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String], // 문자열로 이루어진 배열
  publishedDate: {
    type: Date,
    default: Date.now, // 현재 날짜를 기본값으로 지정
  },
});

// mongoose.model 함수를 이용해 model 생성
const Post = mongoose.model('Post', PostSchema);

export default Post;