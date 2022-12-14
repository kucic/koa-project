import Joi from 'joi';
import User from '../../models/user.js';

/**
  POST /api/auth/register
  {
    username: 'velopert',
    password: 'mypass123'
  }
 */
export const register = async ctx => {
  // 회원가입
  // Request Body 검증
  const schema = Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(20)
      .required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if(result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const {username, password} = ctx.request.body;
  try{
    // username 이 이미 존재하는지 확인
    const exists = await User.findByUsername(username);
    if(exists) {
      ctx.status = 409; // conflict
      return;
    }

    const user = new User({
      username,
    })
    await user.setPassword(password);
    await user.save();

    //응답할 데이터에서 hashedPassword 필드 제거
    // const data = user.toJSON();
    // delete data.hashedPassword;
    // ctx.body = data;
    ctx.body = user.serialize();
    // cookies 에 데이터 담기
    const token = user.generateToken();
    ctx.cookies.set('access_token', tokem {
      maxAge: 100*60*60*24*7, // 7dlf
      httpOnly: true,
    })
  } catch(e) {
    ctx.throw(500, e);
  }
}
/**
  POST /api/auth/login
  {
    username: 'velopert',
    password: 'mypass123'
  }
 */
export const login = async ctx => {
  // 로그인
  const {username, password } = ctx.request.body;

  // username, password 가 없으면 에러처리
  if(!username || !password) {
    ctx.status = 401; // Unauthorized
    return;
  }

  try{
    const user = await User.findByUsername(username);
    // 계정이 존재하지 않으면 에러
    if(!user) {
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(password);
    if(!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();
    // cookie
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 100*60*60*24*7, // 7dlf
      httpOnly: true,
    })
  }catch(e){
    ctx.throw(500, e);
  }
}

export const check = async ctx => {
  // 로그인 상태 확인
  const {user} = ctx.state;
  if(!user) {
    // 로그인 중이 아님
    ctx.status = 401;
    return;
  }
  ctx.body = user;
}

export const logout = async ctx => {
  // 로그아웃
  ctx.cookies.set('access_token');
  ctx.status = 204; // no content
}