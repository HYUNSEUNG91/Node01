const express = require("express");
const User = require("../schemas/user")
const router = express.Router();

// JWT token
const jwt = require("jsonwebtoken");
const token = jwt.sign({test:true}, 'hyunseung-secret-key');
// console.log(token);
const decoded = jwt.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0Ijp0cnVlLCJpYXQiOjE2NDgxOTg0ODJ9.XeR9H7yOFS7fFYoiMCH6diebdL0mnbMCimflcsukPQU")
// console.log(decoded);

// vailidation check
 function vaildCheck(data){ //data = req.body;
    var result={result:true , msg:""};
    // 공백 or 빈값 check --> undefined, null, ""

    // nickname 길이 check
    if(data.nickname == undefined || data.nickname == null ||data.nickname == ""){
        result.msg ="닉네임을 입력해주세요."; // 회원가입 API --> res.send로 전달
        result.result=false;
        return result;
    }else if(data.nickname.length<4){
        result.msg ="닉네임 3이상";
        result.result=false;
        return result;
    // }else if(data.nickname == 특수문자x){

    }else if(data.email==undefined || data.email==null ||data.email==""){
        result.msg ="이메일을 입력해주세요.";
        result.result=false;
        return result;
    }else if(data.password !== data.confirmPassword){
        result.msg ="비밀번호를 확인하세요";
        result.result=false;
        return result;
        
    }
    return result;    
}


// 회원가입 API
router.post("/users", async (req, res) => {
    

    const { email, nickname, password } = req.body;
    const user_list = await User.find().sort({ "userNum": -1 });
    // console.log(user_list)
    let userNum = 0;
    if(user_list.length == 0 || user_list == null){
    // console.log(user_list)
    userNum = 1;
  }else{
    userNum = user_list[0].userNum+1
  }

    //validation check
    var returnData = vaildCheck(req.body);

    if(!returnData.result){
        res.status(400).send({
            errorMessage : returnData.msg
        })
        return;
    }
    ///
    const existUse = await User.find({
        $or : [{nickname}, {email}], //or 조건 표시 --> $or
    });
    if(existUse.length){
        res.status(400).send({
            errorMessage : "이메일 또는 닉네임 중복됩니다."
        })
        return;
    }

    const user = new User({userNum, email, nickname, password});
    await user.save();
    console.log('new-->',user)
    res.status(201).send({
        Message : '회원가입 완료!'
    })
});


// 로그인 API --> 토큰을 그때마다 발행하고 보안 상 POST 사용
router.post("/auth", async (req,res) => {
    const {email, password} = req.body;
    // console.log(req);
    const user = await User.findOne({email, password}).exec();
    
    // 사용자가 없는 경우
    if(!user){
        res.status(400).send({
            errorMessage : '이메일 혹은 패스워드가 잘못됐습니다.'
        });
        return;
    };
    // Token 부여
    
    const token = jwt.sign({ userInfo :user}, "hyunseung-secret-key");
    // const user1 = jwt.decode(token);
    // console.log(user1)
    res.send({
        token
    })
    
    // console.log(token, user) //--> 찍힘
});

// 로그인 후 유져 데이터 필요할 때 사용.
router.post("/loginInfo", async (req, res) => {
    const {token} = req.body;
        // console.log(jwt.decode(token))

    res.json({
        // 작성자와 보고있는 사람 일치여부 확인하기 위해 decode해서 화면으로 보냄.
        userInfo : jwt.decode(token)
    })
});


module.exports = router; //router를 모듈로 내보낸다.