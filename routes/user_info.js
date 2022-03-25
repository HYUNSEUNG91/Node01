const express = require("express");
const User = require("../schemas/user")
const router = express.Router();

// JWT token
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");
const token = jwt.sign({test:true}, 'hyunseung-secret-key');
// console.log(token);
const decoded = jwt.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0Ijp0cnVlLCJpYXQiOjE2NDgxOTg0ODJ9.XeR9H7yOFS7fFYoiMCH6diebdL0mnbMCimflcsukPQU")
// console.log(decoded);





// 회원가입 API
router.post("/users", async (req, res) => {
    const { email, nickname, password, confirmPassword } = req.body;
    console.log({ email, nickname, password, confirmPassword })

    //password 검증
    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage : '비밀번호를 확인하세요'
        });
        // return하지 않으면 return 아래에 있는 코드를 계속 실행함.
        return;
    };

    // nickname, email 검증
    const existUser = await User.find({
        $or : [{nickname}, {email}], //or 조건 표시 --> $or
    });
    console.log('existUser-->',existUser)
    if (existUser.length){
        res.status(400).send({
            errorMessage : '이미 가입된 이메일 또는 닉네임 입니다.'
        });
        return;
    };

    // 중복확인 다른방법 물어보기(개필)
    // if (existUser[1] == nickname && existUser[0] == email){
    //     res.status(400).send({
    //             errorMessage : '이미 가입된 닉네임 입니다.'
    //         });
    //         console.log('response-->',response)
    //         return;
    // };
    const user = new User({email, nickname, password});
    await user.save();
    console.log('new-->',user)
    res.status(201).send({
        Message : '회원가입 완료!'
    })
});


// 로그인 API --> 토큰을 그때마다 발행하고 보안 상 POST 사용
router.post("/auth", async (req,res) => {
    const {email, password} = req.body;
    console.log(req);
    const user = await User.findOne({email, password}).exec();
    
    // 사용자가 없는 경우
    if(!user){
        res.status(400).send({
            errorMessage : '이메일 혹은 패스워드가 잘못됐습니다.'
        });
        return;
    };
    // Token 부여
    const token = jwt.sign({ userId : user.userId}, "hyunseung-secret-key");
    res.send({
        token,
    })
    // console.log(token, user) //--> 찍힘
});

//authMiddleware가 없으면 인증을 못해서 res.local에 정보가 없음.
router.get("/users/me", authMiddleware, async (req, res) => {
    const {user} = res.locals; //res.locals 안에 user키를 const user에 할당
    console.log(user)
    res.status(400).send({

    })
})

module.exports = router; //router를 모듈로 내보낸다.