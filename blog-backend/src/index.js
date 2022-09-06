// 설정
//require('dotenv').config();
import dotEnv from 'dotenv';
dotEnv.config();

//const Koa = require('koa');
//const Router = require('koa-router');
//const bodyParser = require('koa-bodyparser');
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
// api 
// const api = require('./api');
import api from './api/index.js';
import jwtMiddleware from './lib/jwtMiddleware.js';


import * as fakeData from './util/createFakeData.js';

// 비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기?
const {PORT, MONGO_URI } = process.env;

// mongoose
mongoose.connect(MONGO_URI, { useNewUrlParser: true})
	.then(() => {
		console.log('connected to MongoDB');
		//fakeData.createFakePosts(true)
	})
	.catch( e => {
		console.error(e);
	})


const app = new Koa();
const router = new Router();

// router setting
router.use('/api', api.routes()); // api router set

// router 적용전에 bodyparser 적용
app.use(bodyParser());

app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// PORT가 지정되어 있지 않다면 4000을 사용
const port = PORT || 4000;

app.listen(port, () => {
	console.log('listening to prot %d', port);
});