<template>
  <div class="player">
    <!-- <el-upload
      :auto-upload="false"
      :on-change="change"
      action
      accept="audio/basic, audio/mpeg, audio/x-wav"
      multiple
      :show-file-list="false"
      :file-list="musicList"
    >
      <el-button size="small" type="primary">添加歌曲</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <ul>
      <li v-for="(item,key) in musicList" :key="key">
        {{item.raw.name}}
        <el-button type="text" v-if="playId!==item.uid" @click="play(item)">播放</el-button>
        <el-button type="text" v-if="playId===item.uid" @click="stop()">停止</el-button>
      </li>
    </ul>

    <el-progress :percentage="pct" :show-text="false"></el-progress>
    <br />
    <br /> -->

    <el-avatar :size="50" :src="circleUrl"></el-avatar>
    <span style="cursor:pointer;" @click="changeName">{{userName||'点击设置用户名'}}</span>
    <el-upload
      :auto-upload="false"
      :on-change="avat"
      action
      accept="image/jpeg, image/png"
      multiple
      :show-file-list="false"
    >
      <el-button size="small" type="text">更换头像</el-button>
    </el-upload>



    <span>你的IP地址：{{ip}}</span>
    <br />
    <br />
    <el-button type="primary" :disabled="createdRoom" @click="newroom">创建房间</el-button>
    <el-button @click="addroom" :disabled="inroom">加入房间</el-button>

    <br />
    <br />
    <el-row :gutter="20">
      <div v-for="(item,key) in messageList" :key="key">

        <el-col :span="16" :offset="item.from==='me'?8:0">
          <el-avatar v-if="item.from!=='me'" :size="50" :src="staticUrl"></el-avatar>
          <span style="position:absolute;margin-top: -5px;">{{item.name}}</span>
          <div :class="item.from==='me'?'green':'grey'">{{item.message}}</div>
          <el-avatar v-if="item.from==='me'" :size="50" :src="circleUrl"></el-avatar>
        </el-col>
        <br>
      </div>
    </el-row>

    <br />
    <br />
    <el-input
      style="width:calc(100% - 100px);"
      v-model="text"
      @keyup.enter.native="text.length?send():()=>{}"
    ></el-input>
    <el-button @click="send" type="success" :disabled="!text.length||(!inroom&&!createdRoom)">发送</el-button>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>是否创建房间？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="listen">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="加入房间" :visible.sync="dialogVisible1" width="30%">
        <span>请输入要加入房间的IP地址</span>
      <el-input v-model="serverIp"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="addinn" :disabled="!serverIp">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="设置用户名" :visible.sync="nameVisiable" width="30%">
      <el-input v-model="nameForm.name"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nameVisiable = false">取 消</el-button>
        <el-button type="primary" @click="upName">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { setInterval, setTimeout } from "timers";
var fs = require("fs");

export default {
  name: "dash",
  data() {
    return {
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      staticUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      musicList: [],
      ad: document.getElementById("ad"),
      pct: 0,
      userName:localStorage.getItem('userName')||'',
      playId: null,
      serverIp: "",
      text: "",
      nameForm:{
          name:''
      },
      nameVisiable:false,
      messageList: [],
      ip: this.$ip.address(),
      dialogVisible: false,
      dialogVisible1: false,
      inroom: false,
      createdRoom: false
    };
  },
  computed: {},
  mounted() {
    //this.ad=this.$refs.ad
    setInterval(() => {
      let p = (100 * this.ad.currentTime) / (this.ad.duration || 1);
      this.pct = p ? Number(p.toFixed(2)) : 0;
    }, 200);
    console.log(this.$ip.address());

    const src = localStorage.getItem('avatSrc')
    if (src) {
        

      fs.readFile(src, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          data = new Blob([data], { type: localStorage.getItem('avatType') });
          this.circleUrl = URL.createObjectURL(data);
          //console.log(this.$refs.ad.duration)
        }
      });
    }
  },
  methods: {
    newroom() {
      this.dialogVisible = true;
    },
    listen() {
      try {
        this.$bus.io = this.$io(8453);

        this.$bus.io.on("connection", socket => {
          socket.on("message", msg => {
            console.log(msg);
            this.messageList.push({
              ...msg,
              from: "other"
            });
          });

          socket.on("disconnect", () => {
            io.emit("user disconnected");
            console.log(12);
          });
          socket.on("error", res => {
            console.log(111, res);
          });
        });
        this.dialogVisible = false;
        this.createdRoom = true;
      } catch (err) {
        console.log(err);
        this.$message.error("创建失败");
      }
    },
    addroom() {
      this.dialogVisible1 = true;
    },
    changeName(){
        this.nameForm.name=this.userName
        this.nameVisiable=true
    },
    upName(){
        localStorage.setItem('userName',this.nameForm.name)
        this.userName=this.nameForm.name
        this.nameForm.name=''
        this.nameVisiable=false
    },
    addinn() {
      console.log(this.$cio);
      this.$bus.socket = this.$cio.connect(`http://${this.serverIp}:8453`);
      this.$bus.socket.on("message", data => {
        console.log(data);

        this.messageList.push({
          ...data,
          from: "other"
        });
      });
      this.inroom = true;
      this.dialogVisible1 = false;
    },
    send() {
      if (this.inroom) {
        this.$bus.socket.emit("message", {
          message: this.text,
          name:this.userName
        });

        this.messageList.push({
          message: this.text,
          from: "me"
        });
        this.text = "";
      } else {
        this.$bus.io.emit("message", {
          message: this.text,
          name:this.userName
        });

        this.messageList.push({
          message: this.text,
          from: "me"
        });
        this.text = "";
      }
    },
    change(file, fileList) {
      this.musicList = fileList;
      console.log(file, fileList, this.musicList);
    },
    avat(file){
        const src = file.raw.path;
        localStorage.setItem('avatSrc', src);
        localStorage.setItem('avatType', file.raw.type);

      fs.readFile(src, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          data = new Blob([data], { type: file.raw.type });
          this.circleUrl = URL.createObjectURL(data);
          //console.log(this.$refs.ad.duration)
        }
      });
    },
    stop() {
      this.playId = null;
      this.ad.pause();
    },
    play(item) {
      const src = item.raw.path;
      fs.readFile(src, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          data = new Blob([data], { type: item.raw.type });
          this.ad.src = URL.createObjectURL(data);
          this.ad.play();
          this.playId = item.uid;
          //console.log(this.$refs.ad.duration)
        }
      });
    }
  }
};
</script>
<style lang="scss">
.player {
    font-family: "Helvetica Neue","Arial","PingFang SC","Hiragino Sans GB","STHeiti","Microsoft YaHei";
  padding: 20px;
  .el-col{

    margin-top: 15px;
    margin-bottom: 15px;
    vertical-align: top;
  }
  .green {
      display: inline-block;
      width: inherit;
    border-radius: 4px;
    background-color: #67c23a;
    padding: 20px;
    vertical-align: text-top;
    margin-top: -20px;
    //vertical-align: top;
  }
  .grey {
      display: inline-block;
      width: inherit;
    border-radius: 4px;
    background-color: #ddd;
    padding: 20px;
    vertical-align: text-top;
    margin-top: -20px;
    //vertical-align: top;
  }
}
</style>