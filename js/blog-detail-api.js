(function () {
	if (jQuery == undefined || jQuery == null)
		throw "don't import jquery"
	var blogApiUrl = "http://139.155.90.110:8080"
	var curLanguage = '中文'
	//---------- API----------	
	function GetBlogNew(id, cbk) {
		if (!cbk)
			return
		var url = blogApiUrl

		if (document.getElementsByClassName('ontrue').length) {
			curLanguage = document.getElementsByClassName('ontrue')[0].innerText
		} 
		switch (curLanguage) {
			case 'EN':
				url += "/api/news_en/"
				break
			case 'RU':
				url += "/api/news_ru/"
				break
			default:
				url += "/api/news_zh/"
				break
		}
		jQuery.ajax({
			url: url + id + "/", contentType: "application/json", type: "get", success: function (e) {
				if (e.code === 200 || e.code === 2000) {
					if (e.data) {
						cbk(e.data)
					}
					return
				}
				console.error("Gte blog news error,code:" + e.code)
				return
			}
		})
	}
	//-------------------------
	function init(data) {
		var box = document.getElementsByClassName('detail-main mt-200')
		if (!box || box.length <= 0) {
			console.error("Can't find detail element!")
			return
		}
		var backTxt = '返回'
		switch (curLanguage) {
			case 'EN':
				backTxt = "Go Back"
				break
			case 'RU':
				backTxt = "возвращаться"
				break
			default:
				break
		}
		document.title = data.title;
		box[0].innerHTML = '<h1 class="article-title fz-32 darkgreen">' + data.title + '</h1>'
			+ '<div class="article-header mt-60">'
			+ '<div class="article-date fz-18 ">' + data.release_date + '</div>'
			+'</div>'
			+ '<div class="article-body text-center mt-60">' + data.content + '</div>'
			+ '<div class="article-pager mt-60 mb-120"><a href="./blog.html" class="go-back"> <span class="icon-goback" ></span>'+backTxt+' </a></div>';
	}
	window.addEventListener("load", function () {
		var reg = new RegExp('\\?id=([^&/]+)')
		var arr = reg.exec(window.location.href)
		var id = ''
		if (arr.length == 2) {
			id = arr[1]
		}

		GetBlogNew(id, function (data) {
			init(data, false)
		})
		var path = window.location.pathname;
		var search = window.location.search;
		var splitIndex = path.lastIndexOf('/');
		if(document.getElementById('lan_en')){
			document.getElementById('lan_en').onclick = function(){
				window.location.href = path.slice(0,splitIndex)+'/blog-detail-en.html'+search;
			}
		}
		if(document.getElementById('lan_cn')){
			document.getElementById('lan_cn').onclick = function(){
				window.location.href = path.slice(0,splitIndex)+'/blog-detail.html'+search;
			}
		}
		if(document.getElementById('lan_ru')){
			document.getElementById('lan_ru').onclick = function(){
				window.location.href = path.slice(0,splitIndex)+'/blog-detail-ru.html'+search;
			}
		}
	})

	
	
})()