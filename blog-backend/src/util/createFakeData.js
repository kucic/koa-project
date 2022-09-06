import Post from "../models/post.js";

export const removePosts = async () => {
  try{
    await Post.remove()
  }catch(e){
    console.error(e)
  } 
}
export const createFakePosts = async (remove) => {
  try{
    if (remove) {
      await removePosts()
    
    }
    const posts = [...Array(40).keys()].map(i => ({
      title: `post #${i}`,
      body: `bodys #${i}`, 
      tags: ["가짜", '데이터']
    }))
    Post.insertMany(posts, (err, docs) => {
      console.log(docs)
    })
  }catch(e) {
    console.error(e)
  }
 
}