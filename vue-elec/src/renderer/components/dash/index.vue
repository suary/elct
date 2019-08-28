<template>
  <div>

    <el-upload
      :auto-upload="false"
      :on-change="change"
      action=""
      accept="audio/basic,audio/mpeg,audio/x-wav"
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


    <el-progress 
    :percentage="pct"
    :show-text="false">
    </el-progress>
    



  </div>
</template>
<script>
import { setInterval } from 'timers';
var fs = require("fs");

export default {
  name: "dash",
  data() {
    return {
      musicList: [],
      ad:document.getElementById('ad'),
      pct:0,
      playId:null
    };
  },
  computed:{
     
  },
  mounted(){
      //this.ad=this.$refs.ad
      setInterval(()=>{
          let p =100*this.ad.currentTime/(this.ad.duration||1)
          this.pct=p?Number(p.toFixed(2)):0
      },200)
  },
  methods: {
    change(file, fileList) {
      this.musicList=fileList
      console.log(file, fileList,this.musicList);
    },
    stop(){
        this.playId=null
        this.ad.pause()
    },
    play(item){
      const src=item.raw.path
      fs.readFile(src,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                data=new Blob([data],{type:item.raw.type})                
                this.ad.src=URL.createObjectURL(data)
                this.ad.play()
                this.playId=item.uid
                //console.log(this.$refs.ad.duration)
            }
        })
    }
    
  }
};
</script>