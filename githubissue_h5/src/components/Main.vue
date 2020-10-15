<template>
  <div style="width: 100%;height: 100%;margin-top: -50px;">
    <div class="about-container">
      <div class="about-from">Datas From Github API v3</div>
      <div class="about-github">Open source in <el-link type="primary" href="https://github.com/SmileZXLee/githubissue_h5" target="_blank">Githubissue_h5</el-link></div>
    </div>
    <div class="header">
      <img fit="contain" src="../../static/img/githubissue_logo.png" style="height: 100%;">
      <div class="username-input-container">
        <el-input
            clearable
            placeholder="请输入您的用户名"
            prefix-icon="el-icon-user"
            v-model="userName"
            @keyup.enter.native="doIssuesQuery"></el-input>
        <el-button type="primary" @click="doIssuesQuery" style="margin-left: 10px;">查询</el-button>
        <el-button type="success" icon="el-icon-check" plain @click="allReadClick" style="margin-left: 10px;" v-if="!allReaded">全部已读</el-button>
        <el-button type="danger" icon="el-icon-close" plain @click="allUnReadClick" style="margin-left: 10px;" v-if="!allUnreaded">全部未读</el-button>
      </div>
    </div>
    <el-alert
        title="因DNS污染等因素导致经常出现无法访问https://api.github.com的问题,请您稍等几分钟后再试!"
        type="error" v-if="showNetErr"></el-alert>
      </el-alert>
      <el-progress :show-text="false" :stroke-width="2" :percentage="issueLoadPercentage" v-if="issueLoadPercentage!=0&&issueLoadPercentage!=100"></el-progress>
    <el-main>
      <el-table
          border
          :data="allDatas"
          :default-sort = "{prop: 'created_at', order: 'descending'}"
          style="width: 100%;">
          <el-table-column
            align="center"
            prop="repository_html_url"
            label="所属仓库"
            sortable
            width="180">
            <template slot-scope="scope">
              <el-link type="primary" :href="scope.row.repository_html_url" target="_blank">{{scope.row.repository_full_name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="id"
            width="80">
            <template slot-scope="scope">
              <el-link type="primary" :href="scope.row.html_url" target="_blank">#{{scope.row.number}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="标题"
            width="180">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <div v-html="scope.row.title"></div>
                <div slot="reference" class="name-wrapper overflow-ellipsis">
                  {{scope.row.title}}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="内容">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" :disabled="scope.row.body.length==0">
                <div v-html="scope.row.body"></div>
                <div slot="reference" class="name-wrapper overflow-ellipsis">
                  {{scope.row.body.length?scope.row.body:'无'}}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="created_at"
            label="创建时间"
            sortable
            width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 2px">{{timeFormat(scope.row.created_at)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="创建者"
            width="180">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>用户名: {{scope.row.user.login}}</p>
                <p>个人主页: <el-link type="primary" :href="scope.row.user.html_url" target="_blank">{{scope.row.user.html_url}}</el-link></p>
                <div slot="reference" class="name-wrapper">
                  <el-avatar :src="scope.row.user.avatar_url"></el-avatar>
                  <div>{{scope.row.user.login}}</div>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
          align="center"
          prop="is_read"
          sortable
          label="状态">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="!scope.row.is_read" @click="readClick(scope.row)">未读</el-tag>
              <el-tag type="success" v-if="scope.row.is_read" @click="unreadClick(scope.row)">已读</el-tag>
            </template>
          </el-table-column>
        </el-table>
    </el-main>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        showNetErr: false,
        allDatas: [],
        userName: '',
        readedList: [],
        allReaded: true,
        allUnreaded: true,
        issueLoadPercentage: 0
      }
    },
    mounted() {
      this.userName = localStorage.getItem('gi_userName');
      if(this.userName == null){
        this.userName = '';
      }
      this.readedList = JSON.parse(localStorage.getItem(this.readedListSaveKey));
      if(this.readedList == null){
        this.readedList = [];
      }
      if(this.userName.length){
        this.doIssuesQuery();
      }
    },
    methods: {
      timeFormat(time){
        return this.$utils.timeFormat(time);
      },
      doIssuesQuery() {
        if(!this.userName.length){
          this.$message({
            message: '请输入您的用户名',
            type: 'error'
          });
          return;
        }
        this.allDatas = [];
        this.$api.getRepos(this.userName)
          .then(repos => {
            this.showNetErr = false;
            localStorage.setItem('gi_userName',this.userName);
            var totalIssueCount = 0;
            for (let i = 0; i < repos.length; i++) {
              let repo = repos[i];
              if (!repo.fork && repo.open_issues_count) {
                totalIssueCount += repo.open_issues_count;
                this.$api.getIssues(this.userName, repo.name)
                  .then(issues => {
                    if(issues.length){
                      for (let i = 0; i < issues.length; i++) {
                        let issue = issues[i];
                        issue.repository_full_name = repo.full_name;
                        issue.repository_html_url = repo.html_url;
                        issue.is_read = this.readedList.includes(issue.id);
                        this.setAllReadedStatus(issue);
                        this.allDatas.push(issue);
                        this.issueLoadPercentage = this.allDatas.length * 1.0 / totalIssueCount * 100;
                      }
                    }
                  })
              }
            }
          }).catch(repos => {
            this.showNetErr = true;
          })
      },
      unreadClick(item){
        this.$set(item,'is_read',false);
        if(this.readedList.includes(item.id)){
          this.readedList = this.$utils.removeItemFromArr(this.readedList,item.id);
          this.saveReadedList();
        }
      },
      readClick(item){
        this.$set(item,'is_read',true);
        if(!this.readedList.includes(item.id)){
          this.readedList.push(item.id);
          this.saveReadedList();
        }
      },
      allUnReadClick(){
        for(let i = 0;i < this.allDatas.length;i++){
          let issue = this.allDatas[i];
          this.unreadClick(issue);
        }
      },
      allReadClick(){
        for(let i = 0;i < this.allDatas.length;i++){
          let issue = this.allDatas[i];
          this.readClick(issue);
        }
      },
      saveReadedList(){
        this.allReaded = true;
        this.allUnreaded = true;
        if(this.allDatas.length == this.readedList.length || (this.allDatas.length && !this.readedList.length)){
          for(let i = 0;i < this.allDatas.length;i++){
            let issue = this.allDatas[i];
            this.setAllReadedStatus(issue);
          }
        }else{
          this.allReaded = false;
          this.allUnreaded = false;
        }
        localStorage.setItem(this.readedListSaveKey,JSON.stringify(this.readedList))
      },
      setAllReadedStatus(issue){
        if(!issue.is_read){
          this.allReaded = false;
        }else{
          this.allUnreaded = false;
        }
      }
    },
    computed: {
      readedListSaveKey(){
        return 'gi_readedList_' + this.userName.toLowerCase();
      }
    }
  }
</script>

<style scoped>
  .about-container{
    width: 100%;
    height: 35px;
    background-color: #f5f5f5;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .about-from{
    margin-left: 15px;
    font-size: 15px;
    color: gray;
  }
  .about-github{
    margin-right: 15px;
    font-size: 15px;
    color: gray;
  }
  .header{
    display: flex;
    justify-content: space-between;
    height: 80px;
    border-bottom: #eeeeee solid 1px;
  }
  .username-input-container{
    display: flex;
    align-items: center;
  }
  .overflow-ellipsis{
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:3;
  }
</style>
