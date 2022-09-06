const Koa = require('koa'); 

const app = new Koa(); 
/*
  ctx => context
  next => 현제 처리 중인 미들웨어의 다음 미들웨어를 호출하는 함수
    미들웨어를 등록하고 next 함수를 호출하지 않으면 그 다음 미들웨어를 처리하지 않는다. 
**/
app.use( (ctx, next) => {
  console.log(ctx.url);
  console.log(1);
  if (ctx.query.authorized !== '1') {
    ctx.status = 401; // unautohrized
    return;
  }
  // then 사용 가능
  next().then(()=>{
    console.log('END');
  });
});
// async-await 사용 가능
app.use( async (ctx,next)=>{
  console.log(2);
  await next();
  console.log('END 2');
});

app.use(ctx=>{
  ctx.body = 'hello world';
});
app.listen(4000, ()=>{
  console.log('listening to prot 4000')
});
