let postId = 1; // id 초기값

// post 배열 초기 데이터
const posts = [
	{
		id: 1,
		title: '제목', 
		body: '내용',
	},
]; 

/**
포스트 작성
POST /api/posts
{title, body}
*/
//exports.write = ctx => {
	export const write = ctx => {
	// REST API의  Request Body는 ctx.request.body에서 조회할 수 있다. 
	const {title, body} = ctx.request.body;
	postId += 1; // 기존 postId 값에 1을 더한다?
	const post = {id: postOd, title, body};
	posts.push(post);
	ctx.body = post;
};

/**
포스트 목록 조회
GET /api/posts
*/
//exports.list = ctx => {
export const list = ctx => {
	ctx.body = posts;
};

/**
특정 포스트 조회
GET /api/posts/:id
*/
//exports.read = ctx => {
	export const read = ctx => {
	const {id} = ctx.params;
	// 주어진 id 값으로 포스트를 찾는다. 
	const post = posts.find( p=> p.id.toString() === id );
	if (!post) {
		ctx.status = 404;
		ctx.body = {
			message: 'post 가 존재하지 않습니다',
		};
		return;
	}
	ctx.body = post;
};

/** 
특정 포스트 제거
DELETE /api/posts/:id
*/
//exports.remove = ctx => {
	export const remove = ctx => {
	const {id} = ctx.params;
  // 주어진 id 값으로 포스트를 찾는다. 
	const index = posts.findIndex( p=> p.id.toString() === id );
	if (index === -1) {
		ctx.status = 404;
		ctx.body = {
			message: 'post 가 존재하지 않습니다',
		};
		return;
	}
	// delete
	posts.splice(index, 1);
	ctx.status = 204;
};

/**
포스트 수정 교체
PUT /api/posts/:id
{ title, body }
*/
//exports.replace = ctx => {
	export const replace = ctx => {
	const {id} = ctx.params;
  // 주어진 id 값으로 포스트를 찾는다. 
	const index = posts.findIndex( p=> p.id.toString() === id );
	if (index === -1) {
		ctx.status = 404;
		ctx.body = {
			message: 'post 가 존재하지 않습니다',
		};
		return;
	}
	posts[index] = {
		id,
		...ctx.request.body
	};
	ctx.body = posts[index];
};

/**
포스트 수정(특정 필드 변경)
PATCH /api/posts/:id
{ title, body }
*/
//exports.update = ctx => {
	export const update = ctx => {
	const {id} = ctx.params;
  // 주어진 id 값으로 포스트를 찾는다. 
	const index = posts.findIndex( p=> p.id.toString() === id );
	if (index === -1) {
		ctx.status = 404;
		ctx.body = {
			message: 'post 가 존재하지 않습니다',
		};
		return;
	}
	posts[index] = {
		...posts[index],
		...ctx.requests.body
	};
	ctx.body = posts[index];
};