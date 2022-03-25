const express = require("express");
const connect = require("./schemas/write");
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const port = 3000;
connect();


// MongoDB 연결
const mongoose = require("mongoose");
var db = mongoose
.connect("mongodb+srv://sparta:sparta@cluster0.2lhai.mongodb.net/Board?retryWrites=true&w=majority",{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true, //MondDB 6.0 이상에서는 지원 X
        ignoreUndefined: true
    })
    .then(() => console.log('MongoDB 연결완료'))
    .catch(err =>{console.log(err);
});





const writeRouter = require("./routes/board"); // ./는 상대경로. routes에 board 파일 가져옴
const userRouter = require("./routes/user_info")



//request 로그 남기는 미들웨어
const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
};
// body-parser 라이브러리
app.use(express.urlencoded({extend: true}));
 // static 폴터 가져오기
app.use(express.static("static"))
app.use(bodyParser.json());
app.use(express.json());
app.use(requestMiddleware);
app.use("/api", [writeRouter, userRouter]);
app.use("/api", express.urlencoded({ extended: false }), router);
//api 라우터로 들어왔을때만 goodsRouter를 실행한다. [goodsRouter,..] 처럼 2개도 가능.

//view 경로 설정
app.set('views', __dirname + '/views');

//화면 engine을 html로 설정
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//JS 외부에서 불러오기
app.use('/js', express.static(__dirname + "/js"));

// main_List page
app.get("/", async (req, res) => {
    console.log("main_page")    
    bodyParser.json()
    res.sendFile(__dirname + "/static/list.html");
});

// write page
app.get("/write", async (req, res) => {
    console.log("write_page")

    bodyParser.json()
    res.sendFile(__dirname + "/static/write.html");
});

// login_page -->login page 이동 시 토근 삭제(무한루프 방지)
app.get("/login", async (req, res) => {
    console.log("list_page")
    bodyParser.json()
    res.sendFile(__dirname + "/static/login.html");
});

// register_page
app.get("/register", async (req, res) => {
    console.log("list_page")
    bodyParser.json()
    res.sendFile(__dirname + "/static/register.html");
});


app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!")
});