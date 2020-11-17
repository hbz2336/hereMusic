<template>
  <div class="signup">
    <div class="img-wrap">
      <div class="img-con">Welcome<br />Please Regist</div>
      <div class="form-con">
        <el-form
          ref="registerForm"
          :model="registerForm"
          :rules="rules"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="registerForm.sex">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号" prop="phoneNum">
            <el-input
              v-model="registerForm.phoneNum"
              placeholder="手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="birth">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="registerForm.birth"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">立即注册</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registerForm: {
        username: "",
        password: "",
        sex: "",
        phoneNum: "",
        birth: "",
        location: ""
      },
      //所有的地区——省
      cities: [],
      //表单提交规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
        phoneNum: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度在 11 位", trigger: "blur" },
        ],
        birth: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
      },
    };
  },
  methods:{
    // onSubmit(){
    //   let _this=this;
    //   let d=this.registerForm.birth;
    //   let datatime=d.getFullYear()+ '-'+(d.getMonth+1)+'-'+d.getDate();
    //   let params=new URLSearchParams();
    //   params.append('username',this.registerForm.username);
    //   params.append('password',this.registerForm.password);
    //   params.append('sex',this.registerForm.sex);
    //   params.append('birth',this.registerForm.datatime);
    //   params.append('phoneNum',this.registerForm.phoneNum);
    //   params.append('avator',this.registerForm.phoneNum);
    //   onSubmit(params).then(res=>{
    //     if(res.code==1){
    //       _this.notify('注册成功','success');
    //       setTimeout(function(){
    //         _this.$router.push({path,'/'});
    //       },2000);
    //     }else{
    //       _this.notify('注册失败','error');
    //     }
    //   }).catch(err=>{
    //     _this.notify('注册失败','error');
    //   })
    // },
    // goback(index){
    //   this.$router.go(index);
    // }
  }
};
</script>

<style>
.signup {
  width: 1000px;
  height: 100%;
  margin: 0px auto;
  background: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605520228908&di=a3cef04f54954aa8ae02374fc35cc804&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fitbbs%2F1011%2F23%2Fc0%2F5963394_1290487925056_1024x1024.jpg")
    no-repeat;
  background-size: cover;
  /* background:url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605520336397&di=f316ea462eea86f8da5ea11a915bd02f&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fphotoblog%2F1104%2F07%2Fc8%2F7239090_7239090_1302167993793.jpg') no-repeat; */
  overflow: hidden;
}
.signup .img-wrap {
  display: flex;
  background: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605520228908&di=a3cef04f54954aa8ae02374fc35cc804&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fitbbs%2F1011%2F23%2Fc0%2F5963394_1290487925056_1024x1024.jpg")
    no-repeat center left;
  width: 700px;
  height: 400px;
  box-shadow: rgb(141, 140, 140) 0 0 5px 0px;
  margin: 50px 180px;
  overflow: hidden;
}
.signup .img-wrap .img-con {
  flex: 1;
  margin-top: 30px;
  margin-left: 30px;
  font-size: 40px;
  line-height: 40px;
  font-weight: 900;
  color: #444;
  animation: lightSpeedInLeft 1.5s linear;
}
.signup .form-con {
  flex: 1;
  /* position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%); */
  width: 450px;
  /* margin: 20px auto; */
  background-color: #fff;
  padding: 20px;
  animation: fadeInRight 0.8s linear;
}
.signup .el-button--primary {
  background-color: #fccfd8;
  border-color: #fccfd8;
  transition: all 0.3s;
}
.signup .el-button--primary:hover {
  background-color: #efa5b1;
  border-color: #efa5b1;
}
.signup .el-button--default:hover {
  background-color: #efa5b1;
  border-color: #efa5b1;
  color: white;
}
.signup .el-radio__input.is-checked .el-radio__inner {
  background-color: #efa5b1;
  border-color: #efa5b1;
}
.signup .el-radio__input.is-checked + .el-radio__label {
  color: #efa5b1;
}
</style>