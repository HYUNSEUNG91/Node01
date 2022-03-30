const express = require("express");
const router = express.Router();
const Reply = require("../schemas/reply")

// reply router
router.post("/reply", async (req, res,) => {
    console.log("router/api/reply 연결");
    let today = new Date();
    let data = today.toLocaleString();
    
    // html ajax --> 내용을 request 함. 
    const {userNum, reply, boardNum, nickname} = req.body;
    console.log('router->reply->',{userNum, reply, boardNum, nickname})
    if (reply == "" || reply == undefined || reply == null){
      res.send({Message : '댓글을 내용을 입력하세요.'})
      return;
    }
  
    // 내림차순 정렬
    const replyList = await Reply.find({replyNum}).sort({ "replyNum": -1 });
    // console.log(replyList)
    var replyNum = 0;
      if(replyList.length == 0 || replyList == null || replyList == undefined){
        replyNum = 1;
    }else{
      replyNum = replyList[0].replyNum+1
    }
    
    const sendReply = await Reply.create({userNum, reply, boardNum, nickname, data, replyNum});
    res.json({sendReply : sendReply});  // key : value (Json 형태)
    // console.log(sendwrite);
  });
  
  //reply 가져오기
  router.post("/replyList", async (req, res,) => {
    try {
      const {boardNum} = req.body;
      // console.log(req)
      const replyList = await Reply.find({boardNum}).sort({ "replyNum": -1 });
    //   console.log('replyList-->',replyList);
      res.json({ replyList: replyList });
  } catch (err) {
      console.error(err);
  }
  });



  
  router.delete("/replydelete/:replyNum", async (req, res,) => {
    const {replyNum, boardNum} = req.body;
    const replyInfo = await Reply.findOne({replyNum})
    // res.json({
    //   replyInfo
    // })
    // console.log(replyNum);
    const deleteReply = await Reply.deleteOne({replyNum:replyNum});
    // console.log(sendwrite);
    res.json({deleteReply : deleteReply}); 
    // console.log(sendwrite);
  });







module.exports = router; //router를 모듈로 내보낸다.