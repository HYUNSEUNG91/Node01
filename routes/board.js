const express = require("express");
const { json } = require("express/lib/response");
const Write = require("../schemas/write")
const router = express.Router();

router.get("/", (req, res) =>{
    res.send("this is root page");
});


// /api/list --> Json 형식으로 전송받음 -->list.html에서 ajax로 가져감.
router.get("/list", async (req, res) => {
  try {
    // console.log('routerList');
    const write1 = await Write.find().sort({ "userId": -1 });
    // console.log('write-->',write1);
    res.json({ write: write1 });
    //res.render('/list.html', write);
} catch (err) {
    console.error(err);
    next(err);
}
});

// 상세조회 API, DB --> userId 별로 /list/userId_number 설정 (필요x)
router.post("/view/:userId", async (req, res) => {
    //console.log(req)
   const {userId} = req.body;
   const [numId] = await Write.find({userId:userId});
   res.json({
     numId,
   })
   
});

// write.html --> router --> DB --> 게시글 저장
router.post("/write", async (req, res,) => {
  console.log("router/api/write 연결");
  let today = new Date();
  let data = today.toLocaleString();
  
  // html ajax --> 내용을 request 함. 
  const {title, name, comment, password} = req.body;
  // console.log({title, name, comment, password});
  
  //userId 부여 수정 --> sort(내림차순) --> 1번째 + 1
  // list.length --> userId
  const write_list = await Write.find().sort({ "userId": -1 });
  // console.log(write_list)
  let userId = 0;
  if(write_list.length == 0 || write_list == null){
    // console.log(write_list)
    userId = 1;
  }else{
    userId = write_list[0].userId+1
  }
  const sendwrite = await Write.create({ userId ,name, comment, password, title, data});
  res.json({sendwrite : sendwrite});  // key : value (Json 형태)
  console.log(sendwrite);
});

// write.html --> router --> DB --> 게시글 저장
router.post("/modify/:userId", async (req, res,) => {
  console.log("router/api/modify 연결");
  let today = new Date();
  let data = today.toLocaleString();
  
  
  // html ajax --> 내용을 request 함. 
  const {userId , title, name, comment, password} = req.body;
  console.log({userId,title, name, comment, password});
  // userId = 고유함 --> 유저 id 이거일때 뒤에꺼 바꿈
  //updateOne ({A} , {B})
  // A - > 변경될 데이터의 조건
  // B - > 변경될 데이터
  const sendwrite = await Write.updateOne({userId:userId},{name:name, comment:comment, password:password, title:title,data:data});
  res.json({sendwrite : sendwrite});  // key : value (Json 형태)
  // console.log(sendwrite);
});

 //get --> query, post --> body 
 // delete apis
router.delete("/delete/:userId", async (req, res,) => {
  console.log("router/api/delete 연결");
  // html ajax --> 내용을 request 함. 
  // console.log('req-->',req);
  const {userId} = req.body;
  console.log(userId);
  const sendwrite = await Write.deleteOne({userId:userId});
  // console.log(sendwrite);

  res.json({sendwrite : sendwrite}); 
  // console.log(sendwrite);
});

module.exports = router; //router를 모듈로 내보낸다.