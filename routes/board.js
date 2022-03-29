const express = require("express");
const { json } = require("express/lib/response");
const Write = require("../schemas/write")
const Reply = require("../schemas/reply")
const router = express.Router();

router.get("/", (req, res) =>{
    res.send("this is root page");
});


// /api/list --> Json 형식으로 전송받음 -->list.html에서 ajax로 가져감.
router.get("/list", async (req, res) => {
  try {
    // console.log('routerList');
    const write1 = await Write.find().sort({ "boardNum": -1 });
    // console.log('write-->',write1);
    res.json({ write: write1 });
    //res.render('/list.html', write);
} catch (err) {
    console.error(err);
    next(err);
}
});

// 상세조회 API, DB --> boardNum 별로 /list/boardNum 설정
router.post("/view/:boardNum", async (req, res) => {
  //  console.log('req-->',req)
   const {boardNum} = req.body;
   const [boardInfo] = await Write.find({boardNum:boardNum});
  //  console.log('boardInfo-->',boardInfo)
   res.json({
    boardInfo,
   })
   
});

// write.html --> router --> DB --> 게시글 저장
router.post("/write", async (req, res,) => {
  console.log("router/api/write 연결");
  let today = new Date();
  let data = today.toLocaleString();
  
  // html ajax --> 내용을 request 함. 
  const {userNum, title, nickname, comment, password} = req.body;
  console.log('0->',{userNum, title, nickname, comment, password})

  // list 내림차순 정렬
  const BoardList = await Write.find().sort({ "boardNum": -1 });
  // console.log(BoardList)
  let boardNum = 0;
    if(BoardList.length == 0 || BoardList === null || BoardList == undefined){
    boardNum = 1;
  }else{
    boardNum = BoardList[0].boardNum+1
  }
  // console.log('1',boardNum)
  const sendwrite = await Write.create({ userNum, boardNum ,nickname, comment, password, title, data});
  res.json({sendwrite : sendwrite});  // key : value (Json 형태)
  // console.log(sendwrite);
});

// write.html --> router --> DB --> 게시글 저장
router.post("/modify/:boardNum", async (req, res,) => {
  console.log("router/api/modify 연결");
  let today = new Date();
  let data = today.toLocaleString();
  
  
  // html ajax --> 내용을 request 함. 
  const {boardNum , title, nickname, comment, password} = req.body;
  console.log({boardNum,title, nickname, comment, password});
  // userId = 고유함 --> 유저 id 이거일때 뒤에꺼 바꿈
  //updateOne ({A} , {B})
  // A - > 변경될 데이터의 조건
  // B - > 변경될 데이터
  const sendwrite = await Write.updateOne({boardNum:boardNum},{nickname:nickname, comment:comment, password:password, title:title,data:data});
  res.json({sendwrite : sendwrite});  // key : value (Json 형태)
  // console.log(sendwrite);
});

 //get --> query, post --> body 
 // delete apis
router.delete("/delete/:boardNum", async (req, res,) => {
  console.log("router/api/delete 연결");
  // html ajax --> 내용을 request 함. 
  // console.log('req-->',req);
  const {boardNum} = req.body;
  console.log(boardNum);
  const sendwrite = await Write.deleteOne({boardNum:boardNum});
  // console.log(sendwrite);

  res.json({sendwrite : sendwrite}); 
  // console.log(sendwrite);
});







module.exports = router; //router를 모듈로 내보낸다.