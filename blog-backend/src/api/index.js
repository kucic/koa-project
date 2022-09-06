
//const Router = require('koa-router');
//const posts = new require('./posts');

import Router from 'koa-router';
import posts from './posts/index.js';
import auth from './auth/index.js';

const api = new Router(); 

// 회원 관리
api.use('/auth', auth.routes());
// 포스트
api.use('/posts', posts.routes());

// router 를 내보낸다
//module.exports = api
export default api;