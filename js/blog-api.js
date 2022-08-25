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
	var curLanguage = '中文'
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
		var url = blogApiUrl;

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
		url += createQueryParams()
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

	//初始化推荐新闻
	function initTopBlog(data) {
		if (!data)
			return
		var blogTopImgLst = document.getElementsByClassName('blog-top__img img-box')
		if (!blogTopImgLst || blogTopImgLst.length <= 0) {
			console.error("Can't find blog-top__img element!")
			return
		}
		var page = ''
		switch (curLanguage) {
			case 'EN':
				page = "-en"
				break
			case 'RU':
				page = '-ru'
				break
			default:
				break
		}
		var blogTopImgDiv = blogTopImgLst[0]
		var blogTopImg = blogTopImgDiv.firstElementChild
		blogTopImg.src = blogImgUrl + "/" + data.cover  //设置图片
		var topBox = blogTopImgDiv.parentElement	//<a>
		topBox.href = "./blog-detail"+page+".html?id=" + data.id
		topBox.style.display = "block"
		var blogIntroDiv = topBox.children[1]  //简介div
		blogIntroDiv.firstElementChild.innerText = data.release_date
		blogIntroDiv.children[1].innerText = data.title
	}
	function initHotBlog(ulNode, data) {
		if (!data || !ulNode)
			return
		var li = createHotBlogCardLi(data)
		if (!li)
			return
		ulNode.appendChild(li)
	}
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
		var moreText = '更多'
		var page = 'blog-detail.html'
		switch (curLanguage) {
			case 'EN':
				moreText = "more"
				page = 'blog-detail-en.html'
				break
			case 'RU':
				moreText = "Более"
				page = 'blog-detail-ru.html'
				break
		}
		var content = '<a href="./'+page+'?id=' + data.id + '" target="_blank" class="blog-item">' +
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
			'<span class="txt">' + moreText + '</span>' +
			'<span class="ico icon-go"></span>' +
			'</div>' +
			'</div>' +
			'</a>'
		var li = document.createElement('li')
		li.innerHTML = content
		return li
	}

	function createHotBlogCardUl() {
		var recommendText = '	'
		switch (curLanguage) {
			case 'EN':
				recommendText = "morPopular recommendatione"
				break
			case 'RU':
				recommendText = "Популярная рекомендация"
				break
		}
		var li = document.createElement('li')
		li.className = 'list-blog-popular'
		var content = '<div class="popular-blog">' +
			'<h3 class="polular-caption fz-18 text-uppercase darkgreen">' +
			recommendText +
			'</h3>' +
			'<ul class="list list-1 list-popular mt-20">' +

			'</ul>' +
			'</div>'
		li.innerHTML = content
		return li
	}

	function createHotBlogCardLi(data) {
		var page = 'blog-detail.html'
		switch (curLanguage) {
			case 'EN':
				page = 'blog-detail-en.html'
				break
			case 'RU':
				page = 'blog-detail-ru.html'
				break
		}
		var content = ' <li>' +
			' <a href="./'+page+'?id=' + data.id + '" target="_blank" class="related-item">' +
			'  <div class="related-item__img img-box">' +
			'   <img src="' +
			blogImgUrl + "/" + data.cover +
			'" alt="{ImgAlt}">' +
			'  </div>' +
			' <div class="related-item__intro">' +
			' <h3 class="related-item__title fz-14 line2">' +
			data.title +
			'</h3>' +
			' <p class="related-item__date mt-30 fz-14">' +
			data.release_date +
			' </p>' +
			'</div>' +
			'</a>' +
			'</li>    '
		var li = document.createElement('li')
		li.innerHTML = content
		return li
	}

	function init(data, isAppend) {
		if (!data)
			return
		var blogItems = data.data
		var pageSize = data.limit
		if (!blogItems || blogItems.length <= 0)
			return
		var blogListBoxArr = document.getElementsByClassName('blog-list')
		if (!blogListBoxArr || blogListBoxArr.length < 1) {
			console.error("Can't find blog ul element！")
			return
		}
		var blogListBox = blogListBoxArr[0]
		if (blogListBox.childElementCount < 2) {
			console.error("Can't find blog ul element！")
			return
		}
		var blogUlNode = blogListBox.children[1]
		if (!isAppend) {
			blogUlNode.innerHTML = ""
		}
		var topBlogCnt = 0
		var hotBlogCnt = 0
		var blogCnt = 0
		var hotBlogUl = createHotBlogCardUl()
		var hotBlogSubUl = hotBlogUl.children[0].children[1]
		for (var i = 0; i < blogItems.length && i < pageSize; i++) {
			var item = blogItems[i]
			if (item.show_up && !isAppend) {
				if (topBlogCnt <= 0) {
					initTopBlog(item)
					topBlogCnt++
				}
				if (hotBlogCnt <= 3) {
					initHotBlog(hotBlogSubUl, item)
					hotBlogCnt++
				}
			}
			if (blogCnt == 2 && !isAppend) {
				blogUlNode.appendChild(hotBlogUl)
			}
			blogCnt++
			initOtherBlog(blogUlNode, item)
		}
		if (blogCnt <= 2 && !isAppend) {
			blogUlNode.appendChild(hotBlogUl)
		}
	}

	function blogPageMoreBtClick() {
		GetBlogNews(function (data) { init(data, true) })
	}

	function eventBind() {
		var moreBt = document.getElementById('blogPageMoreBt')
		if (moreBt) {
			moreBt.onclick = blogPageMoreBtClick
		}
	}

	function changeCurrentStyle() {
		var tags = document.getElementsByClassName('fz-24')
		for (var i = 0; i < tags.length; i++) {
			if (pageMode === i) {
				tags[i].className = "fz-24 current"
			}
			else {
				tags[i].className = "fz-24"
			}
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
		eventBind()
		changeCurrentStyle()
	})
})()