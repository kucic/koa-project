// const Router = require('koa-router');
// const postsCtrl = require('./posts.ctrl');
import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl.js';

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);

// 리펙토링
/*
posts.get('/:id', postsCtrl.checkObjectId, postsCtrl.read);
posts.delete('/:id', postsCtrl.checkObjectId,  postsCtrl.remove);
posts.put('/:id', postsCtrl.checkObjectId,  postsCtrl.replace);
posts.patch('/:id', postsCtrl.checkObjectId,  postsCtrl.update);
*/
const post = new Router(); // /api/posts/:id
post.get('/', postsCtrl.read);
post.delete('/', postsCtrl.remove);
post.put('/', postsCtrl.replace);
post.patch('/', postsCtrl.update);

posts.use('/:id', postsCtrl.checkObjectId, post.routes());

// module.exports = posts;
export default posts;