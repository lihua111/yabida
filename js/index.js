(function () {
  if (jQuery == undefined || jQuery == null)
    throw "don't import jquery"
  var blogApiUrl = "http://139.155.90.110:8080"
  var blogImgUrl = "https://file-1308196419.cos.ap-nanjing.myqcloud.com"
  //---------- API----------
  var currentPage = 0
  var pageSize = 6
  var pageMode = 0	//0:全部，1：企业新闻，2：公告
  var keyword = ''	//关键字搜索
  function createQueryParams() {
    var str = "limit=" + pageSize
    str += ("&page=" + (currentPage + 1))
    if (pageMode != 0) {
      str += ("&label=" + (pageMode - 1))
    }
    if (keyword != '') {
      str += ("&title=" + keyword)
    }
    return str
  }
  function GetBlogNews(cbk) {
    if (!cbk)
      return
    var url = blogApiUrl
    var curLanguage = '中文'
    if (document.getElementsByClassName('ontrue').length) {
      curLanguage = document.getElementsByClassName('ontrue')[0].innerText
    }
    switch (curLanguage) {
      case 'EN':
        url += "/api/news_en/?"
        break
      case 'RU':
        url += "/api/news_ru/?"
        break
      default:
        url += "/api/news_zh/?"
        break
    }
    // var url = blogApiUrl + "/api/news_zh/?" + createQueryParams()
    jQuery.ajax({
      url: url, contentType: "application/json", type: "get", success: function (e) {
        if (e.code === 200 || e.code === 2000) {
          currentPage = e.data.page
          if (pageMode === 1) {
            e.data.data = e.data.data.filter(r => { return r.label == 0 })
          }
          else if (pageMode === 2) {
            e.data.data = e.data.data.filter(r => { return r.label == 1 })
          }
          cbk(e.data)
          return
        }
        console.error("Gte blog news error,code:" + e.code)
        return
      }
    })
  }
  //-------------------------
  //初始化新闻卡片
  function initOtherBlog(ulNode, data) {
    if (!data || !ulNode)
      return
    var li = createBlogCardLi(data)
    if (!li)
      return
    ulNode.appendChild(li)
  }
  function createBlogCardLi(data) {
    var content = '<a href="./blog-detail.html?id=' + data.id + '" target="_blank" class="blog-item">' +
      '<div class="blog-item__img img-box">' +
      '<img src="' +
      blogImgUrl + "/" + data.cover +
      '" alt="{blogImgAlt}">' +
      '</div>' +
      '<div class="blog-item__info">' +
      '<p class="blog-item__date fz-16">' +
      data.release_date +
      '</p>' +
      '<h3 class="blog-item__title fz-18 line3 mt-20">' +
      data.title +
      '</h3>' +
      '<div class="btn-more mt-30">' +
      '<span class="txt">更多</span>' +
      '<span class="ico icon-go"></span>' +
      '</div>' +
      '</div>' +
      '</a>'
    var li = document.createElement('li')
    li.innerHTML = content
    return li
  }


  function init(data, isAppend) {
    if (!data)
      return
    var blogItems = data.data
    var pageSize = 3
    if (!blogItems || blogItems.length <= 0)
      return
    var blogListBoxArr = document.getElementsByClassName('blog-list')
    if (!blogListBoxArr || blogListBoxArr.length < 1) {
      console.error("Can't find blog ul element！")
      return
    }
    var blogListBox = blogListBoxArr[0]
    console.log('blogListBoxArr>>>>', blogListBox)
    if (blogListBox.childElementCount < 2) {
      console.error("Can't find blog ul element！")
      return
    }
    var blogUlNode = blogListBox.children[1]
    if (!isAppend) {
      blogUlNode.innerHTML = ""
    }
    var blogCnt = 0
    for (var i = 0; i < blogItems.length && i < pageSize; i++) {
      var item = blogItems[i]
      blogCnt++
      initOtherBlog(blogUlNode, item)
    }
    if (blogCnt <= 2 && !isAppend) {
    }
  }

  window.addEventListener("load", function () {
    var reg = new RegExp('\\?query=([^&/]+)')
    var arr = reg.exec(window.location.href)
    if (arr && arr.length == 2) {
      if (arr[1] === 'corporate-news') {
        pageMode = 1
      }
      else if (arr[1] === 'announcements') {
        pageMode = 2
      }
    }
    reg = new RegExp('\\?keyword=([^&/]+)')
    arr = reg.exec(window.location.href)
    if (arr && arr.length == 2) {
      keyword = arr[1]
    }

    GetBlogNews(function (data) { init(data, false) })
  })
})()