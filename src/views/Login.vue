<template>
  <div class="login">
      <div class="img-wrap">
        <div class="img-con">Welcome<br />Please Login</div>
        <div class="form-con">
          <el-form
            ref="registerForm"
            :model="registerForm"
            :rules="rules"
            label-width="80px"
            class="demo-ruleForm"
            labelPosition="left"
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
            <el-form-item>
              <el-button type="primary">登录</el-button>
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
      },
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
      },
    };
  },
};
</script>

<style>
.login {
  background: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605520228908&di=a3cef04f54954aa8ae02374fc35cc804&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fitbbs%2F1011%2F23%2Fc0%2F5963394_1290487925056_1024x1024.jpg") no-repeat;
  background-size: cover;
  width: 1000px;
  height: 100%;
  margin: 0px auto;
  overflow: hidden;
}

.login .img-wrap {
  display: flex;
  background: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605520228908&di=a3cef04f54954aa8ae02374fc35cc804&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fitbbs%2F1011%2F23%2Fc0%2F5963394_1290487925056_1024x1024.jpg")
    no-repeat center left;
  width: 700px;
  height: 300px;
  box-shadow: rgb(141, 140, 140) 0 0 5px 0px;
  margin: 100px 180px;
  overflow: hidden;
}
.login .img-wrap .img-con {
  flex: 1;
  margin-top: 30px;
  margin-left: 30px;
  font-size: 40px;
  line-height: 40px;
  font-weight: 900;
  color: #444;
  animation: lightSpeedInLeft 1.5s linear;
}
.login .form-con {
  flex: 1;
  width: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin: 20px auto; */
  background-color: #fff;
  padding: 20px;
  animation: fadeInRight 0.8s linear;
}
.login .el-button--primary {
  background-color: #fccfd8;
  border-color: #fccfd8;
  transition: all 0.3s;
}
.login .el-button--primary:hover {
  background-color: #efa5b1;
  border-color: #efa5b1;
}
.login .el-button--default:hover {
  background-color: #efa5b1;
  border-color: #efa5b1;
  color: white;
}
.login .el-radio__input.is-checked .el-radio__inner {
  background-color: #efa5b1;
  border-color: #efa5b1;
}
.login .el-radio__input.is-checked + .el-radio__label {
  color: #efa5b1;
}
.login .el-form-item:last-child {
  margin-bottom: 0;
}
</style>