import mongoose from 'mongoose';
import Joi from 'joi';
import Post from '../../models/post.js';

const {ObjectId} = mongoose.Types;

export const checkObjectId = (ctx, next) => {
  const {id} = ctx.params;
  if(!ObjectId.isValid(id)){
    ctx.status = 400;
    return;
  }
  return next();
}
/**
포스트 작성
POST /api/posts
{
  title: '제목',
  body: '내용',
  tags: ['tag1', 'tag2']
*/
export const write = async ctx => { 
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 잇음을 검증
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array()
      .items(Joi.string())
      .required(), // 문자열로 이루어진 배열
  })

  // 검증하고나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if(result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  
  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,   
    body,
    tags,
  })
  console.log("post write : ", post)
  try{
    await post.save();
    ctx.body = post;
  } catch(e) {
    ctx.throw(500, e);
  }
};

/**
포스트 목록 조회
GET /api/posts
*/
export const list = async ctx => { 
    
  let order = parseInt(ctx.query.order || '1' , 1);
  const limit = parseInt(ctx.query.limit || '10', 10);
  const page = parseInt(ctx.query.page || '1' , 1);

  // check value
  if (page < 1 || limit < 1 ) {
    ctx.status = 400;
    return;
  }
  // 변환
  if (order !== 1 && order !== -1) {
    order = 1;
  }

  let skip = (page -1) * limit; 

  try{
    const posts = await Post.find()
      .sort({publishedDate: order})
      .limit(limit)
      .skip(skip)
      .lean() // 가져올때 json 형태로 가져오게된다. 
      .exec();

    const postCount = await Post.countDocuments().exec();
    console.log(postCount)
    ctx.set('totalCount', postCount);
    ctx.set('lastPage', Math.ceil(postCount/limit));

    // data 변환 body 의 길이를 200 으로 제한해서 보낸다. 
    // ctx.body = posts;
    ctx.body = posts
      // .map(post => post.toJSON()) <- .lean() 을 사용하지않았을땐 json 형태로 변환 필요
      .map(post => ({
        ...post,
        body: post.body.length < 200 ? post.body : `${post.body.slice(0,200)}...`
      }));
  } catch(e) {
    ctx.throw(500, e);
  }
};

/**
특정 포스트 조회
GET /api/posts/:id
*/
export const read = async ctx => {
  const {id} = ctx.params; 
  // id 가  ObjectId 가 아니면 catch 로 들어간다. 
  try{
    const post = await Post.findById(id).exec();
    console.log('find post : ', post)
    if(!post){
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = post;
  }catch(e){
    console.error('read error : ', e)
    ctx.throw(500, e);
  }
};

/** 
특정 포스트 제거
DELETE /api/posts/:id
remove()          : 특정 조건을 만족하는 데이터를 모두 지웁니다. 
findByIdRemove()  : id 를 찾아서 지웁니다.
findOneAndRemove()  : 특정 조건을 만족하는 데이터 하나를 찾아서 제거 
*/
export const remove = async ctx => {
  const {id} = ctx.params;
  try{
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content
  }catch(e){
    ctx.throw(500, e);
  }
};

/**
포스트 수정 교체
PUT /api/posts/:id
{ title, body }
*/
export const replace = async ctx => {
  const { id } = ctx.params;
  try{
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환한다. 
      // fase 일때는 업데이트되기 전의 데이터를 반환한다. 
    }).exec()
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  }catch(e){
    ctx.throw(500, e);
  }
};

/**
포스트 수정(특정 필드 변경)
PATCH /api/posts/:id
{ title, body }
*/
export const update = async ctx => {
  const { id } = ctx.params;
  // write 와 비슷하지만 required가 없다. 
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string())
  })
  const result = schema.validate(ctx.request.body);
  if(result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  try{
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환한다. 
      // fase 일때는 업데이트되기 전의 데이터를 반환한다. 
    }).exec()
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  }catch(e){
    ctx.throw(500, e);
  }
};