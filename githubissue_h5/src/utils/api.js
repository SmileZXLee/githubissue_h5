import request from './request.js'
const api = {}
api.getRepos=function(userName){
  return request({
    url: `/users/${userName}/repos?per_page=1000`,
    method: 'get'
  })
}

api.getIssues=function(userName,repoName){
  return request({
    url: `/repos/${userName}/${repoName}/issues`,
    method: 'get'
  })
}

export default api
