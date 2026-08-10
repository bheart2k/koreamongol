// UI 공통
function ctrlUi() {
	var menuAll = $('#menu_all');
	var gnbArea = $('.gnb > .inner');
	var gnbList = $('.list_gnb');
	var gnbDepth = $('.list_gnb>li>ul');	//추가
	var gnbMenu = gnbList.find('li a');
	var lnbMenu = $('.list_lnb li a');
	var comboOption = $('.combo > .selected > a');

	// top 버튼 표시
	$(window).scroll(function() {
		if ($(this).scrollTop() > 200) {
			$('#btn_go_top').fadeIn();
		} else {
			$('#btn_go_top').fadeOut();
		}
	});

	// top 버튼 클릭시 맨 위로 이동
	$('#btn_go_top').on('click', function() {
		$('html, body').stop().animate({scrollTop: 0});
	});

	// 전체메뉴 영역 내에서만 전체메뉴 활성화
	menuAll.hover(function() {
		$(this).addClass('active');
	}, function() {
		$(this).removeClass('active');
	});

	// gnb 리스트 오버시 전체메뉴 표시
	/*gnbList.on('mouseover', function() {
		if (!(menuAll.hasClass('active'))) {
			menuAll.addClass('active');
		}
	});*/

	 // gnb 메뉴 클릭시 활성화
	/*gnbMenu.on('click', function() {
		gnbList.find('li').removeClass('active');
		$(this).parent().addClass('active');
	})*/


	//gnb 접근성작업  2020.06

	//한국어, 중국어 gnb 높이
	var lengTotCnt = 0;
	gnbDepth.each(function(i){
		if(lengTotCnt < $(this).find("a").length){
			lengTotCnt = $(this).find("a").length;
		}
	});
	gnbDepth.height(lengTotCnt*35);
	
	gnbList.bind('mouseover keyup', function(event) {
		event.preventDefault();
		gnbList.removeClass('active');
		gnbList.addClass('active');
		menuover=true;
	})
	$('.list_gnb>li').bind('mouseover keyup', function(event) {
		$('.list_gnb>li').removeClass('on');
		$(this).addClass('on');
	})
	gnbList.bind('mouseleave blur', function(event) {
		event.preventDefault();
		gnbList.removeClass('active');
		$('.list_gnb>li').removeClass('on');
		menuover=false;
	})
	$('.list_gnb > li:last-child ul > li:last-child a').bind('mouseleave blur', function(event) { //키보드 벗어날 경우 active 삭제 안되는 오류 추가작업
		event.preventDefault();
		gnbList.removeClass('active');
		$('.list_gnb>li').removeClass('on');
		menuover=false;
	})
	$('.menu h1 a').on('focus', function(){	//키보드 역방향시
		$('.list_gnb').removeClass('active');
	})


	// gnb 영역 아웃시 전체메뉴 비활성화
	/*gnbArea.on('mouseleave', function() {
		if (menuAll.hasClass('active')) {
			menuAll.removeClass('active');
		}
	});*/
/*
	// 사이드바
	lnbMenu.on('mouseover', function() {
		if (!($(this).parent().hasClass('active'))) {
			$(this).parent().parent().find('li').removeClass('active');
			$(this).parent().addClass('active', 100);
		}
	});
*/

	// 사이드바
	lnbMenu.on('click', function() {
		if (!($(this).parent().hasClass('active'))) {
			$(this).parent().parent().find('>li').removeClass('active').find('>a').attr('aria-expanded', 'false');
			$(this).parent().addClass('active', 100);
			$(this).attr('aria-expanded', 'true'); // 202306
		}else{
			$(this).parent().parent().find('>li').removeClass('active');
			$(this).parent().find('>a').attr('aria-expanded', 'false'); // 202306
		}
	});

	$('.list_lnb').find('> li a[target=_BLANK]').each(function() {  //웹접근성 추가
        $(this).attr('title', '새창 열림');
	});

	// DBcontent 로딩시, 디자인 적용을 목적으로 버튼 영역 내 button 타입 input에 class 강제 추가('button_apply')
	$('#button_default').find('input[type=button]').each(function() {
		if (!($(this).hasClass('button_apply'))) {
			$(this).addClass('button_apply');
		}
	});

	// 통합검색
	$('.btn_gnb_search').on('click', function() {
		var searchAll = $('#search_all');

		// 전체메뉴 닫기
		menuAll.removeClass('active');

		if (!(searchAll.hasClass('active'))) {
			searchAll.addClass('active');
			$('.form_input input').focus(); //웹접근성
		}

		// 우측 닫기버튼 클릭 시 통합검색 비활성화
		searchAll.find('.btn_close_search_all').on('click', function() {
			searchAll.removeClass('active');
			$('.search_word button').focus();  //웹접근성
		});
	});

	// 다운로드 콤보박스
	comboOption.on('click', function() {
		var comboCurrentOption = $(this);
		var	comboBox = $(this).parent().parent();
		var comboExpand = comboBox.find('.expand');
		var comboExpandOption = comboExpand.find('a');

		if (!(comboBox.hasClass('active'))) {
			// 확장메뉴 열기
			comboBox.addClass('active');

			// 콤보박스 옵션 선택 시, 선택한 텍스트와 class, title 복사 후 확장메뉴 닫기
			comboExpandOption.on('click', function() {
				comboCurrentOption.html($(this).html());
				comboCurrentOption.attr({
					'class': $(this).attr('class'),
					'title': $(this).attr('title')
				});
				comboBox.removeClass('active');
			});

			// 확장메뉴 닫기
			comboExpand.on('mouseleave', function() {
				comboBox.removeClass('active');
			});
		}
	});
	//접근성 작업
	$('.expand a:last-child').on('mouseout blur', function() {
		$('.download_viewer').removeClass('active');
	});

	// col tab control
	$('.tab_container').each(function() {
		var tab = $(this);
		var tabId = tab.attr('id');
		var tabButton = $('#' + tabId + '> .tab_list > ul > li');
		var tabContent = $('#' + tabId + '> .tab_content > .tab_item');
		var activeButton = $('#' + tabId + '> .tab_list > ul > li.active > a');

		// 초기 설정
		tabButton.removeClass('active');
		tabButton.eq(0).addClass('active');
		tabContent.removeClass('active');
		tabContent.eq(0).addClass('active');

		// 탭 버튼 클릭시 해당 인덱스 탭 컨텐츠 활성화
		activeButton.attr('title', '선택됨')
		tabButton.find('a').on('click', function() {
			if (!($(this).parent().hasClass('active'))) {
				var idx = $(this).parent().index();

				tabButton.removeClass('active');
				tabContent.removeClass('active');
				tabButton.find('a').removeAttr('title')//2022_a11y
				tabButton.eq(idx).addClass('active');
				tabContent.eq(idx).addClass('active');
				$(this).attr('title', '선택됨')//2022_a11y
			}
		});
	});

	//서브 탭 (등록, 거소)
	$('.tab_list.stab > ul > li > a').on('click', function() {
		$(this).attr('title', '선택됨');
		$(this).parent().siblings().children().attr('title', '');
	});
	$('.tab_list > ul > li > span').each(function(){
		$(this).parent().hasClass('active') ? $(this).attr('title', '선택됨') : $(this).removeAttr('title') 
	})

	//페이징(웹접근성작업)
	$('.paging .first').html('처음으로 이동');
	$('.paging .prev').html('10페이지 이전으로 이동');
	$('.paging .next').html('10페이지 다음으로 이동');
	$('.paging .end').html('마지막으로 이동');
	$('.paging a').removeAttr('title');
	$('.paging').children().find('.current').attr('title', '현재 페이지');


	// row tab control
	$('.tab_row').each(function() {
		var tab = $(this);
		var tabId = tab.attr('id');
		var tabItem = $('#' + tabId + '> .item');
		var tabTitle = tabItem.find('> .item_title');

		// 초기 설정
		tabItem.eq(0).addClass('active');

		// 탭 버튼 클릭시 해당 인덱스 탭 컨텐츠 활성화
		tabTitle.on('click', function() {
			if (!($(this).parent().hasClass('active'))) {
				tabItem.removeClass('active');
				$(this).parent().addClass('active');
			}
		});
	});

	// file upload
	/*$('.grp_upload_file').each(function() {
		var formId = $(this).attr('id');
		var inputFile = $('#' + formId + '> form .submit .upload_file');
		var showFile = $('#' + formId + '> form .selected .upload_file_name');
		console.log('id===' + formId);

		// 파일명 추출
		inputFile.on('change', function() {
			if (window.FileReader) {
				var filename = $(this)[0].files[0].name;
			} else {
				var filename = $(this).val().split('/').pop().split('\\').pop();
			}

			// 파일명 삽입
			$(showFile).val(filename);
		});
	});*/

	// accordion check list
	$('.list_expand_toggle').each(function() {
		var list = $(this);
		var checkbox = list.find('li .bar_title .fr input[type=checkbox]');
		var title = list.find('li .bar_title .fl a');

		// 체크박스 체크/체크안함 이벤트
		checkbox.on('click', function() {
			if ($(this).is(':checked')) {
				$(this).parent().parent().parent().addClass('checked');
			} else {
				$(this).parent().parent().parent().removeClass('checked');
			}
		});
	});

	//오른쪽 마우스 클릭 금지
	$(document).bind("contextmenu",function(e){
		return false;
	});
	
}

var userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();
var isSafari;
if (/macintosh/.test(userAgent)) {
	if(/safari/.test(userAgent) && !/crios/.test(userAgent)) {
		isSafari = true;
	}
}

// 웹브라우저 히스토리 기능 통제 추가
function preventBack() {
	// Mac 사파리 아닐 경우
	if (!isSafari) {
		history.pushState(null, null, location.href);
		
		window.onpopstate = function(event){
			history.go(1);
		};
    }
}

// 시간 선택 테이블
function ctrlTimeTable() {
	// 시간 버튼 선택시 활성화
	$('.select_time_table').each(function() {
		var objId = $(this).attr('id');
		var time = $('#' + objId).find('.group_time > div > a');

		time.on('click', function() {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		});
	});
}

// 메인화면
function ctrlMain() {
	// 말줄임
	//$('#slider_visual > li > .visual_text > div').ellipsis();
	//$('#slider_news_letter > li > .box_title > a > .desc').ellipsis();
	//$('.main_board .list .list_board li div .ellipsis').ellipsis();

	// 비주얼영역 슬라이드
	var sliderMainVisual = $('#slider_visual').bxSlider({
		startSlide: 0,
		prevSelector: '#btn_go_prev_visual',
		prevText: '알림 이전',
		nextSelector: '#btn_go_next_visual',
		nextText: '알림 다음',
		auto: true,
		speed: 500,
		pause: 3000,
		mode: 'horizontal',
		slideWidth: 340,
		autoControls: true,
		tickerHover: true,
		pager: true,
		easing: 'easeOutElastic',
		// 2022_a11y
		onSliderLoad: function () {
			$('.bx-clone').find('a').prop('tabIndex', '-1')
		},
		onSlideAfter: function () {
			$('#slider_visual')
				.children('li')
				.each(function () {
					if ($(this).attr('aria-hidden') == 'false') {
						$(this).find('a').attr('tabIndex', '0')
					} else {
						$(this).find('a').attr('tabIndex', '-1')
					}
				})
		}
	});
	// 2022_a11y
	$('#slider_visual a').focusin(function () {
		sliderMainVisual.stopAuto()
	})
	
	var totalCntSliderMainVisual = sliderMainVisual.getSlideCount();
	$('.box_control_slider2').css('width', 90+(20*(totalCntSliderMainVisual-1)));
	
	$(document).on('click','#btn_pause_visual', function() {
		if ($(this).hasClass('stop')) {
			$('#btn_pause_visual').removeClass('stop').addClass('pause');
			$('#btn_pause_visual.pause a i').text('알림 슬라이드 정지');
			sliderMainVisual.startAuto();
		} else {
			$('#btn_pause_visual').addClass('stop').removeClass('pause');
			$('#btn_pause_visual.stop a i').text('알림 슬라이드 재생');
			sliderMainVisual.stopAuto();
		}
	});

}

// 팝업 열기
function openPopup(url, width, height) {
	window.open(url, '_blank', '새창', 'menubar=no, status=no, toolbar=no, scrollbars=no, resizable=yes, width=' + width + ', height=' + height);
}

// 팝업 닫기
function closePopup() {
	window.close();
}

// 말줄임
$.fn.ellipsis = function() {
	return this.each(function() {
		var el = $(this);
		if (el.css('overflow') == 'hidden') {
			var text = el.html();
			var multiline = el.hasClass('multiline');
			var t = $(this.cloneNode(true))
				.hide()
				.css({
					'max-height': 'none',
					'position': 'absolute',
					'overflow': 'visible'
				})
				.width(multiline ? el.width() : 'auto')
				.height(multiline ? 'auto' : el.height());

			el.after(t);
			//function height() { return t.height() > el.height(); };
			//function width() { return t.width() > el.width(); };

			var func = multiline ? height : width;

			while (text.length > 0 && func()) {
				text = text.substr(0, text.length - 1);
				t.html(text + '<em>...</em>');
			}

			el.attr('title', el.text().replace(/[\t]/g,'').replace(/[\r\n]/g,''));
			el.html(t.html());
			t.remove();
		}
	});
}

/**
 * @type   : function
 * @access : public
 * @desc   : 입력값이 영문과 숫자인지 체크
 * <pre>
 *     cfNoHangul("123");
 * </pre>
 * 위와같이 사용했을 경우 영문과 숫자인지 체크
 * @sig    : sOrg
 * @param  : sOrg - required 체크할 문자열
 * @return : true(한글이 존재하지 않음)/false(한글이 존재함)
 */
function cfNoHangul(sOrg) {
    var AlphaDigit;
    var IDLength;
    var NumberChar, CompChar;
    var ChkFlag;

    AlphaDigit= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    IDLength = sOrg.length;

    for (i = 0; i < IDLength; i++) {
        NumberChar = sOrg.charAt(i);
        ChkFlag = false;
        for (j = 0; j < AlphaDigit.length ; j++) {
            CompChar = AlphaDigit.charAt(j);
            if (NumberChar.toLowerCase() == CompChar.toLowerCase()){
                ChkFlag = true;
            }
        }
        if (ChkFlag == false) return false;
    }
    return true;
}

/**
 * @type   : function
 * @access : public
 * @desc   : window.open으로 서브창을 띄울 때 서브창의 위치를 간단하게 지정할 수 있다.
 * @sig    : width, height, position, [sURL] [, sName] [, sFeatures] [, bReplace]
 * @param  : width - 서브창의 넓이
 * @param  : height - 서브창의 높이
 * @param  : position  - 서브창의 위치 (default : 5) <br><br>
 * <table border='1'>
 *     <tr>
 *         <td>1</td>
 *         <td>2</td>
 *         <td>3</td>
 *     </tr>
 *     <tr>
 *         <td>4</td>
 *         <td>5</td>
 *         <td>6</td>
 *     </tr>
 *     <tr>
 *         <td>7</td>
 *         <td>8</td>
 *         <td>9</td>
 *     </tr>
 * </table>
 * @param  : sURL      - required window.open의 sURL 파라미터와 동일
 * @param  : sName     - required window.open의 sName 파라미터와 동일
 * @param  : sFeatures - required window.open의 sFeatures 파라미터와 동일
 * @param  : bReplace  - required window.open의 bReplace 파라미터와 동일
 * @author : 임재현
 */
function cfOpen(sWidth, sHeight, position, sURL, sName, sFeatures, bReplace) {
    var left = 0;
    var top = 0;

    var featureNames  = ["status", "menubar", "toolbar"];
    var featureValues = ["no", "no", "no"];
    var featureTypes  = ["boolean", "boolean", "boolean"];

    if (sFeatures != null) {
        cfParseOpenFeature(sFeatures, featureNames, featureValues, featureTypes);
    }

    var status = featureValues[0];
    var menubar = featureValues[1];
    var toolbar = featureValues[2];

    if (sWidth != null && sHeight != null) {
        width = sWidth*1 + 10; // window의 좌우 border 5px씩 감안.
        height = sHeight*1 + 29; // titlebar는 기본으로 감안.

        if (menubar) {
            height = height + 48;
            //IE인 경우 menubar가 yes이면 height가 20px 늘어난다.
            if( document.all ) {
                height = height - 20;
                sHeight = sHeight - 20;
            }
        }

        if (toolbar) {
            height = height + 27;
        }

        if (status) {
            height = height + 20;
        }

        switch (position) {
            case 1 :
                left = 0;
                top = 0;
                break;

            case 2 :
                left = (screen.availWidth - width) / 2;
                top = 0;
                break;

            case 3 :
                left = screen.availWidth - width;
                top = 0;
                break;

            case 4 :
                left = 0;
                top = (screen.availHeight - height) / 2;
                break;

            case 5 :
                left = (screen.availWidth - width) / 2;
                top = (screen.availHeight - height) / 2;
                break;

            case 6 :
                left = screen.availWidth - width;
                top = (screen.availHeight - height) / 2;
                break;

            case 7 :
                left = 0;
                top = screen.availHeight - height;
                break;

            case 8 :
                left = (screen.availWidth - width) / 2;
                top = screen.availHeight - height;
                break;

            case 9 :
                left = screen.availWidth - width;
                top = screen.availHeight - height;
                break;

            default :
                left = (screen.availWidth - width) / 2;
                top = (screen.availHeight - height) / 2;
                break;
        }

        //IE의 height 보정
        if( document.all ){
            sHeight = sHeight - 3.5;
        }

        if (cfIsNull(sFeatures)) {
            sFeatures = "width=" +sWidth+ ",height=" +sHeight + ",left=" + left + ",top=" + top;
        } else {
            sFeatures = sFeatures +",width=" +sWidth+ ",height=" +sHeight + ",left=" + left + ",top=" + top;
        }
    }

    var newWindow = window.open(sURL, sName, sFeatures, bReplace);
    newWindow.focus();
    return newWindow;
}

/**
 * @type   : function
 * @access : private
 * @desc   : features 스트링을 파싱하여 array에 셋팅하는 내부 함수
 * @sig    : features, fNameArray, fValueArray, fTypeArray
 * @param  : features    - required features를 표현한 스트링
 * @param  : fNameArray  - required 추출해야 할 feature의 이름에 대한 array
 * @param  : fValueArray - required 추출해야 할 feature의 기본값에 대한 array
 * @param  : fTypeArray  - required 추출해야 할 feature의 데이터타입에 대한 array
 * @author : 임재현
 */
function cfParseOpenFeature(features, fNameArray, fValueArray, fTypeArray) {
    if (features == null) {
        return;
    }

    var featureArray = features.split(",");
    var featurePair;

    for (var i = 0; i < featureArray.length; i++) {
        featurePair = featureArray[i].trim().split("=");

        for (var j = 0; j < fNameArray.length; j++) {
            if (featurePair[0] == fNameArray[j]) {
                switch (fTypeArray[j]) {
                    case "string" :
                        fValueArray[j] = featurePair[1];
                        break;
                    case "number" :
                        fValueArray[j] = Number(featurePair[1]);
                        break;
                    case "boolean" :
                        if (featurePair[1].toUpperCase() == "YES" || featurePair[1].toUpperCase() == "TRUE" || featurePair[1] == "1") {
                            fValueArray[j] = true;
                        } else {
                            fValueArray[j] = false;
                        }
                        break;
                }
            }
        }
    }
}

/**
 * @type   : function
 * @access : public
 * @desc   : 값이 null 이거나 white space 문자로만 이루어진 경우 true를 리턴한다.
 * <pre>
 *     cfIsNull("  ");
 * </pre>
 * 위와같이 사용했을 경우 true를 리턴한다.
 * @sig    : value
 * @param  : value - required 입력값
 * @return : boolean. null(혹은 white space) 여부
 * @author : 임재현
 */
function cfIsNull(value) {
    if (value == null ||
        (typeof(value) == "string" && value.trim() == "")
       ) {
        return true;
    }
    return false;
}

/**
 * @type   : function
 * @access : public
 * @desc   : 입력값이 영문&숫자인지 체크
 * <pre>
 *     cfChkAlpa_Number("123abc");
 * </pre>
 * 위와같이 사용했을 경우 영문과 숫자인지 체크
 * @sig    : sOrg
 * @param  : sOrg - required 체크할 문자열
 * @return : true(영문&숫자로 이루어져있음)/false
 * @author : 한현주
 */
function cfChkAlpa_Number(sOrg) {
    var Alpha, Digit;
    var IDLength1, IDLength2;
    var EngStr, NumStr;
    var NumberChar, CompChar;
    var ChkNumFlag ,ChkAlpaFlag;
    var result = false;

    Alpha= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    Digit= "0123456789";

    EngStr = cfGetAlphaOnly(sOrg) ;
    NumStr = cfGetNumberOnly(sOrg) ;

    IDLength1 = EngStr.length;
    IDLength2 = NumStr.length;

    for (i = 0; i < IDLength1; i++) {

        NumberChar = EngStr.charAt(i);
        ChkAlpaFlag = false;

        for (j = 0; j < Alpha.length ; j++) {
            CompChar = Alpha.charAt(j);
            if (NumberChar.toLowerCase() == CompChar.toLowerCase()){
                ChkAlpaFlag = true;
            }
        }
    }

    for (i = 0; i < IDLength2; i++) {

        NumberChar = NumStr.charAt(i);
        ChkNumFlag = false;

        for (j = 0; j < Digit.length ; j++) {
            CompChar = Digit.charAt(j);
            if (NumberChar.toLowerCase() == CompChar.toLowerCase()){
                ChkNumFlag = true;
            }
        }
    }

    if((ChkAlpaFlag == true) && (ChkNumFlag == true))
		result = true;

    return result;
}

/**
 * @type   : function
 * @access : public
 * @desc   : 입력값에서 영문자만 추출하여리턴
 * <pre>
 *     cfGetAlphaOnly("123abc");
 * </pre>
 * @sig    : sOrg
 * @param  : sOrg - required 체크할 문자열
 * @return : 영문자로 이루어진 문자열
 * @author : 한현주
 */
function cfGetAlphaOnly(sOrg) {
	return sOrg.replace(/[^a-zA-Z]/g, "");
}

/**
 * @type   : function
 * @access : public
 * @desc   : 오직 숫자만 입력가능하게 만드는 펑션.<br>(onkeypress 이벤트에 호출한다)
 * @sig    : e
 * @param  : e - 이벤트
 * <pre>
 *    onkeypress="cfInputNumRT(event);"
 * </pre>
 * @return : void
 * @author : 한현주
 */
function cfInputNumRT(e){

	if(window.event){    //IE
       	e = window.event;
       	var lkeycode = e.keyCode;
    }else{				//W3C
    	var lkeycode = e.which;
    }

    if(e.type == "keypress"){
	    if( !((48 <= lkeycode && lkeycode <=57) || lkeycode == 13 || lkeycode == 8 || lkeycode == 0) ){
			if( window.event ){
	    		e.returnValue = false;
	    	}else{
	        	e.preventDefault();
	    	}
	    }
    }else{
	    if( !((48 <= lkeycode && lkeycode <=57) || (96 <= lkeycode && lkeycode <=105) || lkeycode == 13 || lkeycode == 8 || lkeycode == 46 || lkeycode == 229) ){
			var charVal = String.fromCharCode(lkeycode);
			if(charVal != null && charVal != ""){
				var eVal = e.srcElement.value;
				if(eVal.length > 0) e.srcElement.value = eVal = eVal.replace(charVal, "");
			}
	    }
    }
}

/**
 * @type   : function
 * @access : public
 * @desc   : 숫자를 제외한 모든 문자를 제거한다.
 * <pre>
 *     cfGetNumberOnly("2006.01.02");"
 *     위와같이 사용했을 경우 '20060102'를 return
 * </pre>
 * @sig    : sOrg
 * @param  : sOrg - required 문자열
 * @return : 치환된 문자열 스트링
 * @author : 정연주
 */
function cfGetNumberOnly(sOrg) {
	return sOrg.replace(/[^0-9]/g, "");
}

/**
 * @type   : function
 * @access : public
 * @desc   : 비밀번호 숫자+특수+영문(8~16자리)
 * @sig    : sOrg
 * @author : 이완섭
 */
function cfChkPassword(sOrg){
	var reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}/;

	return reg.test(sOrg)  ? true : false;

}

/********************************************
@함수명  	cfChkId
@desc   	입력한 문자열이 아이디 규칙(숫자+특수+영문)으로 구성되어 있는지 체크한다.
@sig   	String str
@반환    	true (문자열이 아이디 규칙에 맞게 구성되어 있는 경우),
		  	false (문자열에 아이디 규칙 외의 문자가 있는 경우)
*********************************************/
/**
 * @type   : function
 * @access : public
 * @desc   : 입력한 문자열이 숫자+영문+특수문자(_-.)로 구성되어 있는지 체크한다.
 * @sig    : sOrg
 * @return : true (문자열이 아이디 규칙에 맞게 구성되어 있는 경우),
		  	false (문자열에 아이디 규칙 외의 문자가 있는 경우)
 */
function cfChkId(sOrg){
	var reg = /[^A-Za-z0-9-_\.]/;

	return reg.test(sOrg) ? false : true;
}

/**
 * @type   : function
 * @access : public
 * @desc   : 성명(4~39자리)
 * @sig    : sOrg
 * @author :
 */
function cfChkFnm(sOrg){
	var reg = /[A-Za-z\s]{4,39}/;

	return reg.test(sOrg)  ? true : false;
}

//다국어
$(function(){
	if(gfv_seLang == "KR"){ $('html').attr('lang', 'ko'); }
	else if(gfv_seLang == "CH"){ $('body').addClass('ch'); $('html').attr('lang', 'zh'); }
	else if(gfv_seLang == "EN"){ $('body').addClass('en'); $('html').attr('lang', 'en'); }
})

/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
/*
var Menubar = function (domNode) {
	var elementChildren,
	  msgPrefix = 'Menubar constructor argument menubarNode ';

	// Check whether menubarNode is a DOM element
	if (!(domNode instanceof Element)) {
	  throw new TypeError(msgPrefix + 'is not a DOM Element.');
	}

	// Check whether menubarNode has descendant elements
	if (domNode.childElementCount === 0) {
	  throw new Error(msgPrefix + 'has no element children.');
	}

	// Check whether menubarNode has A elements
	e = domNode.firstElementChild;
	while (e) {
	  var menubarItem = e.firstElementChild;
	  if (e && menubarItem && menubarItem.tagName !== 'A') {
		throw new Error(msgPrefix + 'has child elements are not A elements.');
	  }
	  e = e.nextElementSibling;
	}

	this.isMenubar = true;

	this.domNode = domNode;

	this.menubarItems = []; // See Menubar init method
	this.firstChars = []; // See Menubar init method

	this.firstItem = null; // See Menubar init method
	this.lastItem = null; // See Menubar init method

	this.hasFocus = false; // See MenubarItem handleFocus, handleBlur
	this.hasHover = false; // See Menubar handleMouseover, handleMouseout
  };


  *   @method Menubar.prototype.init
  *
  *   @desc
  *       Adds ARIA role to the menubar node
  *       Traverse menubar children for A elements to configure each A element as a ARIA menuitem
  *       and populate menuitems array. Initialize firstItem and lastItem properties.

  Menubar.prototype.init = function () {
	var menubarItem, childElement, menuElement, textContent, numItems;


	// Traverse the element children of menubarNode: configure each with
	// menuitem role behavior and store reference in menuitems array.
	elem = this.domNode.firstElementChild;

	while (elem) {
	  menuElement = elem.firstElementChild;

	  if (elem && menuElement && menuElement.tagName === 'A') {
		menubarItem = new MenubarItem(menuElement, this);
		menubarItem.init();
		this.menubarItems.push(menubarItem);
		textContent = menuElement.textContent.trim();
		this.firstChars.push(textContent.substring(0, 1).toLowerCase());
	  }

	  elem = elem.nextElementSibling;
	}

	// Use populated menuitems array to initialize firstItem and lastItem.
	numItems = this.menubarItems.length;
	if (numItems > 0) {
	  this.firstItem = this.menubarItems[ 0 ];
	  this.lastItem = this.menubarItems[ numItems - 1 ];
	}
	this.firstItem.domNode.tabIndex = 0;
  };

   FOCUS MANAGEMENT METHODS

  Menubar.prototype.setFocusToItem = function (newItem) {

	var flag = false;

	for (var i = 0; i < this.menubarItems.length; i++) {
	  var mbi = this.menubarItems[i];

	  if (mbi.domNode.tabIndex == 0) {
		flag = mbi.domNode.getAttribute('aria-expanded') === 'true';
	  }

	  mbi.domNode.tabIndex = -1;
	  if (mbi.popupMenu) {
		mbi.popupMenu.close();
	  }
	}

	newItem.domNode.focus();
	newItem.domNode.tabIndex = 0;

	if (flag && newItem.popupMenu) {
	  newItem.popupMenu.open();
	}
  };

  Menubar.prototype.setFocusToFirstItem = function (flag) {
	this.setFocusToItem(this.firstItem);
  };

  Menubar.prototype.setFocusToLastItem = function (flag) {
	this.setFocusToItem(this.lastItem);
  };

  Menubar.prototype.setFocusToPreviousItem = function (currentItem) {
	var index;

	if (currentItem === this.firstItem) {
	  newItem = this.lastItem;
	}
	else {
	  index = this.menubarItems.indexOf(currentItem);
	  newItem = this.menubarItems[ index - 1 ];
	}

	this.setFocusToItem(newItem);

  };

  Menubar.prototype.setFocusToNextItem = function (currentItem) {
	var index;

	if (currentItem === this.lastItem) {
	  newItem = this.firstItem;
	}
	else {
	  index = this.menubarItems.indexOf(currentItem);
	  newItem = this.menubarItems[ index + 1 ];
	}

	this.setFocusToItem(newItem);

  };

  Menubar.prototype.setFocusByFirstCharacter = function (currentItem, char) {
	var start, index;
	var flag = currentItem.domNode.getAttribute('aria-expanded') === 'true';

	char = char.toLowerCase();

	// Get start index for search based on position of currentItem
	start = this.menubarItems.indexOf(currentItem) + 1;
	if (start === this.menubarItems.length) {
	  start = 0;
	}

	// Check remaining slots in the menu
	index = this.getIndexFirstChars(start, char);

	// If not found in remaining slots, check from beginning
	if (index === -1) {
	  index = this.getIndexFirstChars(0, char);
	}

	// If match was found...
	if (index > -1) {
	  this.setFocusToItem(this.menubarItems[ index ]);
	}
  };

  Menubar.prototype.getIndexFirstChars = function (startIndex, char) {
	for (var i = startIndex; i < this.firstChars.length; i++) {
	  if (char === this.firstChars[ i ]) {
		return i;
	  }
	}
	return -1;
  };



*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document

var MenubarItem = function (domNode, menuObj) {

	this.menu = menuObj;
	this.domNode = domNode;
	this.popupMenu = false;

	this.hasFocus = false;
	this.hasHover = false;

	this.isMenubarItem = true;

	this.keyCode = Object.freeze({
	  'TAB': 9,
	  'RETURN': 13,
	  'ESC': 27,
	  'SPACE': 32,
	  'PAGEUP': 33,
	  'PAGEDOWN': 34,
	  'END': 35,
	  'HOME': 36,
	  'LEFT': 37,
	  'UP': 38,
	  'RIGHT': 39,
	  'DOWN': 40
	});
  };

  MenubarItem.prototype.init = function () {
	this.domNode.tabIndex = -1;

	this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
	this.domNode.addEventListener('focus', this.handleFocus.bind(this));
	this.domNode.addEventListener('blur', this.handleBlur.bind(this));
	this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
	this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

	// Initialize pop up menus

	var nextElement = this.domNode.nextElementSibling;

	if (nextElement && nextElement.tagName === 'UL') {
	  this.popupMenu = new PopupMenu(nextElement, this);
	  this.popupMenu.init();
	}

  };

  MenubarItem.prototype.handleKeydown = function (event) {
	var tgt = event.currentTarget,
	  char = event.key,
	  flag = false,
	  clickEvent;

	function isPrintableCharacter (str) {
	  return str.length === 1 && str.match(/\S/);
	}

	switch (event.keyCode) {
	  case this.keyCode.SPACE:
	  case this.keyCode.RETURN:
	  case this.keyCode.DOWN:
		if (this.popupMenu) {
		  this.popupMenu.open();
		  this.popupMenu.setFocusToFirstItem();
		  flag = true;
		}
		break;

	  case this.keyCode.LEFT:
		this.menu.setFocusToPreviousItem(this);
		flag = true;
		break;

	  case this.keyCode.RIGHT:
		this.menu.setFocusToNextItem(this);
		flag = true;
		break;

	  case this.keyCode.UP:
		if (this.popupMenu) {
		  this.popupMenu.open();
		  this.popupMenu.setFocusToLastItem();
		  flag = true;
		}
		break;

	  case this.keyCode.HOME:
	  case this.keyCode.PAGEUP:
		this.menu.setFocusToFirstItem();
		flag = true;
		break;

	  case this.keyCode.END:
	  case this.keyCode.PAGEDOWN:
		this.menu.setFocusToLastItem();
		flag = true;
		break;

	  case this.keyCode.TAB:
		this.popupMenu.close(true);
		break;

	  case this.keyCode.ESC:
		this.popupMenu.close(true);
		break;

	  default:
		if (isPrintableCharacter(char)) {
		  this.menu.setFocusByFirstCharacter(this, char);
		  flag = true;
		}
		break;
	}

	if (flag) {
	  event.stopPropagation();
	  event.preventDefault();
	}
  };

  MenubarItem.prototype.setExpanded = function (value) {
	if (value) {
	  this.domNode.setAttribute('aria-expanded', 'true');
	}
	else {
	  this.domNode.setAttribute('aria-expanded', 'false');
	}
  };

  MenubarItem.prototype.handleFocus = function (event) {
	this.menu.hasFocus = true;
  };

  MenubarItem.prototype.handleBlur = function (event) {
	this.menu.hasFocus = false;
  };

  MenubarItem.prototype.handleMouseover = function (event) {
	this.hasHover = true;
	this.popupMenu.open();
  };

  MenubarItem.prototype.handleMouseout = function (event) {
	this.hasHover = false;
	setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
  };


*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document

var PopupMenu = function (domNode, controllerObj) {
	var elementChildren,
	  msgPrefix = 'PopupMenu constructor argument domNode ';

	// Check whether domNode is a DOM element
	if (!(domNode instanceof Element)) {
	  throw new TypeError(msgPrefix + 'is not a DOM Element.');
	}
	// Check whether domNode has child elements
	if (domNode.childElementCount === 0) {
	  throw new Error(msgPrefix + 'has no element children.');
	}
	// Check whether domNode descendant elements have A elements
	var childElement = domNode.firstElementChild;
	while (childElement) {
	  var menuitem = childElement.firstElementChild;
	  if (menuitem && menuitem === 'A') {
		throw new Error(msgPrefix + 'has descendant elements that are not A elements.');
	  }
	  childElement = childElement.nextElementSibling;
	}

	this.isMenubar = false;

	this.domNode    = domNode;
	this.controller = controllerObj;

	this.menuitems = []; // See PopupMenu init method
	this.firstChars = []; // See PopupMenu init method

	this.firstItem = null; // See PopupMenu init method
	this.lastItem = null; // See PopupMenu init method

	this.hasFocus = false; // See MenuItem handleFocus, handleBlur
	this.hasHover = false; // See PopupMenu handleMouseover, handleMouseout
  };


  *   @method PopupMenu.prototype.init
  *
  *   @desc
  *       Add domNode event listeners for mouseover and mouseout. Traverse
  *       domNode children to configure each menuitem and populate menuitems
  *       array. Initialize firstItem and lastItem properties.

  PopupMenu.prototype.init = function () {
	var childElement, menuElement, menuItem, textContent, numItems, label;

	// Configure the domNode itself

	this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
	this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

	// Traverse the element children of domNode: configure each with
	// menuitem role behavior and store reference in menuitems array.
	childElement = this.domNode.firstElementChild;

	while (childElement) {
	  menuElement = childElement.firstElementChild;

	  if (menuElement && menuElement.tagName === 'A') {
		menuItem = new MenuItem(menuElement, this);
		menuItem.init();
		this.menuitems.push(menuItem);
		textContent = menuElement.textContent.trim();
		this.firstChars.push(textContent.substring(0, 1).toLowerCase());
	  }
	  childElement = childElement.nextElementSibling;
	}

	// Use populated menuitems array to initialize firstItem and lastItem.
	numItems = this.menuitems.length;
	if (numItems > 0) {
	  this.firstItem = this.menuitems[ 0 ];
	  this.lastItem = this.menuitems[ numItems - 1 ];
	}
  };

   EVENT HANDLERS

  PopupMenu.prototype.handleMouseover = function (event) {
	this.hasHover = true;
  };

  PopupMenu.prototype.handleMouseout = function (event) {
	this.hasHover = false;
	setTimeout(this.close.bind(this, false), 1);
  };

   FOCUS MANAGEMENT METHODS

  PopupMenu.prototype.setFocusToController = function (command, flag) {

	if (typeof command !== 'string') {
	  command = '';
	}

	function setFocusToMenubarItem (controller, close) {
	  while (controller) {
		if (controller.isMenubarItem) {
		  controller.domNode.focus();
		  return controller;
		}
		else {
		  if (close) {
			controller.menu.close(true);
		  }
		  controller.hasFocus = false;
		}
		controller = controller.menu.controller;
	  }
	  return false;
	}

	if (command === '') {
	  if (this.controller && this.controller.domNode) {
		this.controller.domNode.focus();
	  }
	  return;
	}

	if (!this.controller.isMenubarItem) {
	  this.controller.domNode.focus();
	  this.close();

	  if (command === 'next') {
		var menubarItem = setFocusToMenubarItem(this.controller, false);
		if (menubarItem) {
		  menubarItem.menu.setFocusToNextItem(menubarItem, flag);
		}
	  }
	}
	else {
	  if (command === 'previous') {
		this.controller.menu.setFocusToPreviousItem(this.controller, flag);
	  }
	  else if (command === 'next') {
		this.controller.menu.setFocusToNextItem(this.controller, flag);
	  }
	}

  };

  PopupMenu.prototype.setFocusToFirstItem = function () {
	this.firstItem.domNode.focus();
  };

  PopupMenu.prototype.setFocusToLastItem = function () {
	this.lastItem.domNode.focus();
  };

  PopupMenu.prototype.setFocusToPreviousItem = function (currentItem) {
	var index;

	if (currentItem === this.firstItem) {
	  this.lastItem.domNode.focus();
	}
	else {
	  index = this.menuitems.indexOf(currentItem);
	  this.menuitems[ index - 1 ].domNode.focus();
	}
  };

  PopupMenu.prototype.setFocusToNextItem = function (currentItem) {
	var index;

	if (currentItem === this.lastItem) {
	  this.firstItem.domNode.focus();
	}
	else {
	  index = this.menuitems.indexOf(currentItem);
	  this.menuitems[ index + 1 ].domNode.focus();
	}
  };

  PopupMenu.prototype.setFocusByFirstCharacter = function (currentItem, char) {
	var start, index;

	char = char.toLowerCase();

	// Get start index for search based on position of currentItem
	start = this.menuitems.indexOf(currentItem) + 1;
	if (start === this.menuitems.length) {
	  start = 0;
	}

	// Check remaining slots in the menu
	index = this.getIndexFirstChars(start, char);

	// If not found in remaining slots, check from beginning
	if (index === -1) {
	  index = this.getIndexFirstChars(0, char);
	}

	// If match was found...
	if (index > -1) {
	  this.menuitems[ index ].domNode.focus();
	}
  };

  PopupMenu.prototype.getIndexFirstChars = function (startIndex, char) {
	for (var i = startIndex; i < this.firstChars.length; i++) {
	  if (char === this.firstChars[ i ]) {
		return i;
	  }
	}
	return -1;
  };

   MENU DISPLAY METHODS

  PopupMenu.prototype.open = function () {
	// Get position and bounding rectangle of controller object's DOM node
	var rect = this.controller.domNode.getBoundingClientRect();

	// Set CSS properties
	if (!this.controller.isMenubarItem) {
	  this.domNode.parentNode.style.position = 'relative';
	  this.domNode.style.display = 'block';
	  this.domNode.style.position = 'absolute';
	  this.domNode.style.left = rect.width + 'px';
	  this.domNode.style.zIndex = 100;
	}
	else {
	  this.domNode.style.display = 'block';
	  this.domNode.style.position = 'absolute';
	  this.domNode.style.top = (rect.height - 1) + 'px';
	  this.domNode.style.zIndex = 100;
	}

	this.controller.setExpanded(true);

  };

  PopupMenu.prototype.close = function (force) {

	var controllerHasHover = this.controller.hasHover;

	var hasFocus = this.hasFocus;

	for (var i = 0; i < this.menuitems.length; i++) {
	  var mi = this.menuitems[i];
	  if (mi.popupMenu) {
		hasFocus = hasFocus | mi.popupMenu.hasFocus;
	  }
	}

	if (!this.controller.isMenubarItem) {
	  controllerHasHover = false;
	}

	if (force || (!hasFocus && !this.hasHover && !controllerHasHover)) {
	  this.domNode.style.display = 'none';
	  this.domNode.style.zIndex = 0;
	  this.controller.setExpanded(false);
	}
  };


*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document

var MenuItem = function (domNode, menuObj) {

	if (typeof popupObj !== 'object') {
	  popupObj = false;
	}

	this.domNode = domNode;
	this.menu = menuObj;
	this.popupMenu = false;
	this.isMenubarItem = false;

	this.keyCode = Object.freeze({
	  'TAB': 9,
	  'RETURN': 13,
	  'ESC': 27,
	  'SPACE': 32,
	  'PAGEUP': 33,
	  'PAGEDOWN': 34,
	  'END': 35,
	  'HOME': 36,
	  'LEFT': 37,
	  'UP': 38,
	  'RIGHT': 39,
	  'DOWN': 40
	});
  };

  MenuItem.prototype.init = function () {
	this.domNode.tabIndex = -1;

	this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
	this.domNode.addEventListener('click', this.handleClick.bind(this));
	this.domNode.addEventListener('focus', this.handleFocus.bind(this));
	this.domNode.addEventListener('blur', this.handleBlur.bind(this));
	this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
	this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

	// Initialize flyout menu

	var nextElement = this.domNode.nextElementSibling;

	if (nextElement && nextElement.tagName === 'UL') {
	  this.popupMenu = new PopupMenu(nextElement, this);
	  this.popupMenu.init();
	}

  };

  MenuItem.prototype.isExpanded = function () {
	return this.domNode.getAttribute('aria-expanded') === 'true';
  };

   EVENT HANDLERS

  MenuItem.prototype.handleKeydown = function (event) {
	var tgt  = event.currentTarget,
	  char = event.key,
	  flag = false,
	  clickEvent;

	function isPrintableCharacter (str) {
	  return str.length === 1 && str.match(/\S/);
	}

	switch (event.keyCode) {
	  case this.keyCode.SPACE:
	  case this.keyCode.RETURN:
		if (this.popupMenu) {
		  this.popupMenu.open();
		  this.popupMenu.setFocusToFirstItem();
		}
		else {

		  // Create simulated mouse event to mimic the behavior of ATs
		  // and let the event handler handleClick do the housekeeping.
		  try {
			clickEvent = new MouseEvent('click', {
			  'view': window,
			  'bubbles': true,
			  'cancelable': true
			});
		  }
		  catch (err) {
			if (document.createEvent) {
			  // DOM Level 3 for IE 9+
			  clickEvent = document.createEvent('MouseEvents');
			  clickEvent.initEvent('click', true, true);
			}
		  }
		  tgt.dispatchEvent(clickEvent);
		}

		flag = true;
		break;

	  case this.keyCode.UP:
		this.menu.setFocusToPreviousItem(this);
		flag = true;
		break;

	  case this.keyCode.DOWN:
		this.menu.setFocusToNextItem(this);
		flag = true;
		break;

	  case this.keyCode.LEFT:
		this.menu.setFocusToController('previous', true);
		this.menu.close(true);
		flag = true;
		break;

	  case this.keyCode.RIGHT:
		if (this.popupMenu) {
		  this.popupMenu.open();
		  this.popupMenu.setFocusToFirstItem();
		}
		else {
		  this.menu.setFocusToController('next', true);
		  this.menu.close(true);
		}
		flag = true;
		break;

	  case this.keyCode.HOME:
	  case this.keyCode.PAGEUP:
		this.menu.setFocusToFirstItem();
		flag = true;
		break;

	  case this.keyCode.END:
	  case this.keyCode.PAGEDOWN:
		this.menu.setFocusToLastItem();
		flag = true;
		break;

	  case this.keyCode.ESC:
		this.menu.setFocusToController();
		this.menu.close(true);
		flag = true;
		break;

	  case this.keyCode.TAB:
		this.menu.setFocusToController();
		break;

	  default:
		if (isPrintableCharacter(char)) {
		  this.menu.setFocusByFirstCharacter(this, char);
		  flag = true;
		}
		break;
	}

	if (flag) {
	  event.stopPropagation();
	  event.preventDefault();
	}
  };

  MenuItem.prototype.setExpanded = function (value) {
	if (value) {
	  this.domNode.setAttribute('aria-expanded', 'true');
	}
	else {
	  this.domNode.setAttribute('aria-expanded', 'false');
	}
  };

  MenuItem.prototype.handleClick = function (event) {
	this.menu.setFocusToController();
	//this.menu.close(true);
  };

  MenuItem.prototype.handleFocus = function (event) {
	this.menu.hasFocus = true;
  };

  MenuItem.prototype.handleBlur = function (event) {
	this.menu.hasFocus = false;
	setTimeout(this.menu.close.bind(this.menu, false), 300);
  };

  MenuItem.prototype.handleMouseover = function (event) {
	this.menu.hasHover = true;
	this.menu.open();
	if (this.popupMenu) {
	  this.popupMenu.hasHover = true;
	  this.popupMenu.open();
	}
  };

  MenuItem.prototype.handleMouseout = function (event) {
	if (this.popupMenu) {
	  this.popupMenu.hasHover = false;
	  this.popupMenu.close(true);
	}

	this.menu.hasHover = false;
	setTimeout(this.menu.close.bind(this.menu, false), 300);
  };



//  param 다국어 추가
 function getUrlParams() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
}
$(function(){
	//oParam = getUrlParams();
	//$('body').addClass(oParam.locale);
	//console.log(oParam.locale, "oParam.locale : 퍼블리셔 아웃 풋")
	if(gfv_seLang == "KR"){ $('html').attr('lang', 'kr'); }
	else if(gfv_seLang == "CH"){ $('body').addClass('ch'); $('html').attr('lang', 'zh'); }
	else if(gfv_seLang == "EN"){ $('body').addClass('en'); $('html').attr('lang', 'en'); }

	// console.log(gnb_link_depth3)
	var d_time = 800 // 마우스 아웃시 돌아가는 시간
	var depth1_d_time = 800 //1뎁스 메뉴 아웃시 돌아가는 시간
	var current_menu1, current_menu2, current_menu3;
	var clearenter
	var  gnb_link_depth1= $('.list_gnb>li'); // 1depth
	var  gnb_link_depth2= $('.list_gnb>li.on>ul>li'); // 2depth
	var  gnb_link_depth3= $('.list_gnb>li.on>ul>li.on>ul>li'); // 3depth
	var lnbs = $('.list_lnb'); //lnbsidebar
	var lnb_depth1 = $('.list_lnb>li'); // 2depth
	var lnb_depth2 = $('.list_lnb>li.on>ul>li'); // 2depth
	for (var i = 0; i < gnb_link_depth1.length; i++) {
		if (0 < $(gnb_link_depth1[i]).hasClass('on')) {
			current_menu1 = i;
		}
	}
	for (var i = 0; i < $(gnb_link_depth2).length; i++) {
		if (0 < $(gnb_link_depth2).eq(i).hasClass('on')) {
			current_menu2 = i;
		}
	}
	for (var i = 0; i < $(gnb_link_depth3).length; i++) {
		if (0 < $(gnb_link_depth3).eq(i).hasClass('on')) {
			current_menu3 = i;
		}
	}
	gnb_link_depth1.each(function (index) {//1depth action
		$(this).find('>a').bind('mouseenter keyup', function () {
			clearTimeout(clearenter);
			menuover = true;
			$(this).parent().addClass("on").siblings().removeClass("on");
		});
		$(this).bind('mouseleave blur focusout', function () {
			menuover = false;
			clearenter = setTimeout(menuclear, depth1_d_time);
		});
	});

	lnb_depth1.each(function (index) {//1depth action
		$(this).find('>a').bind('mouseenter keyup focus', function () {
			clearTimeout(clearenter);
			menuover = true;
			$(this).parent().addClass("on").siblings().removeClass("on");
		});
		$(this).bind('mouseleave blur', function () {
			menuover = false;
			clearenter = setTimeout(menuclear, depth1_d_time);
		});
	});
	$(lnbs).bind('mouseleave blur', function () {
		menuover = false;
		clearenter = setTimeout(menuclear, depth1_d_time);
	});

	lnb_depth2.each(function (index) {//1depth action
		$(this).find('>a').bind('mouseenter keyup', function () {
			clearTimeout(clearenter);
			menuover = true;
			$(this).parent().addClass("on").siblings().removeClass("on");
		});
		$(this).bind('mouseleave blur', function () {
			menuover = false;
			clearenter = setTimeout(menuclear, depth1_d_time);
		});
	});
	function menuclear() {//first seting
		gnb_link_depth1.removeClass("on");
		gnb_link_depth2.removeClass("on");
		gnb_link_depth3.removeClass("on");
		lnb_depth1.removeClass("on");
		lnb_depth2.removeClass("on");
		if (!menuover) {
			$(gnb_link_depth1[current_menu1]).addClass('on');// 현재 메뉴 on
			$(gnb_link_depth1[current_menu1]).find('li').eq(current_menu2).addClass('on');
			$(gnb_link_depth1[current_menu1]).find('li').eq(current_menu2).find('li').eq(current_menu3).addClass('on');

			$(lnb_depth1[current_menu2]).addClass('on');
			$(lnb_depth1[current_menu2]).find('li').eq(current_menu3).addClass('on');
		}
	}
	//console.log("current1", current_menu1, "current2", current_menu2, "current3", current_menu3);
	//console.log("lnb_depth1", $(lnb_depth1).eq(current_menu2), "lnb_depth2", $(lnb_depth1).eq(current_menu3));
})
*/


//table summary 자동완성 ver 1.4 (2020.06 웹접근성작업 html5용 table caption)
//by designerhee@gamil.com
//html5 형식 조건 추가 20141117
//html5 서머리 제외시킬 조건 추가 대상테이블 noSummary class 추가 20150807
/*
20150602
버그수정 rowSpan값이 16일때 무한루프 발생
rowSpan 에대한 for문이 k로 설정되어잇어 상위 for문의 기본값과 중첩 발생으로 인한 무한루프
2019-01-30 : rowspan 문제가 있어서 조정함, details속성이 있는경우 제외 추가.
*/

jQuery(function(){
	// 2022_a11y
	$('.btn_go.prev.active').text('이전 목록으로 이동');
	$('.list_lnb>li>a').each(function(){
		if($(this).next('ul').length > 0) $(this).attr('aria-expanded', 'false');
		if($(this).parent().hasClass('active')) $(this).attr('aria-expanded', 'true');

		//if($(this).next('ul').length > 0){
			//$(this).attr('aria-expanded', 'false')
		//}
		//$(this).bind('click', function(){
			//if($(this).next('ul').length > 0){
			//	$(this).attr('aria-expanded')=='false'? $(this).attr('aria-expanded', 'true') : $(this).attr('aria-expanded', 'false')
			//}
		//})
	})
	$('table[summary]').removeAttr('summary');

	$('table:has(caption)')
        .not(':has(details)')
        .each(function(index){
            var summaryText='';//내용 초기화
            var thLength = $(this).find('th').length;
            for (var i=0;i<$(this).find('th').length;i++) {
                if(jQuery(this).find('th').eq(i).attr('colspan')>1){
                }
            }
            //테이블 셀 좌표설정
        var thpoint= new Array();
        //셀 좌표 초기값 설정
        $(this).find('tr').each(function (tri) {
            thpoint[tri]= new Array();
            var preColstart = 0;
            $(this).find('>').each(function(thi){
                if (this.nodeName=="TH"){
                    if($(this).attr('colspan')>1){
                        var temp2 = parseInt($(this).attr('colspan'))
                        var temp = preColstart + temp2 - 1;
                        /*
                        startcol = 시작 좌표 x
                        endcol = 종료 좌표 x
                        thpoint = <tr> 행
                        colhead = <th> colspan속성 유무
                        rows = <tr> 행 0부터 시작
                        txts = <th> 텍스트
                        Sinset = 서머리 텍스트에 반영 유무
                        */
                        thpoint[tri][thi]={startcol:preColstart,endcol:temp,colhead:true,rows:tri,txts:$(this).text(),Sinset:false}
                        preColstart = temp+1;
                    }else if($(this).attr('rowspan')>1){
                        thpoint[tri][thi]={
                            startcol:preColstart,
                            endcol:preColstart,
                            colhead:'rowSpan',
                            rows:tri,
                            txts:$(this).text(),
                            Sinset:false,
                            rowspan:$(this).attr('rowspan')
                        }
                        preColstart+=1;
                    }else{
                        thpoint[tri][thi]={startcol:preColstart,endcol:preColstart,colhead:false,rows:tri,txts:$(this).text(),Sinset:false}
                        preColstart+=1;
                    }
                }else{
                    thpoint[tri][thi]={startcol:0,endcol:0,colhead:0,rows:0,txts:0,Sinset:true}
                }//if nodeName end
            });
        });
        // 초기 좌표설정 끝
        // rowspan이 2이상인경우에 2번째 행부터 좌표 재설정
        var vs = thpoint.length
        //return false;
        for(var i=0;i<vs;i++){
            for(var k=0;k<thpoint[i].length;k++){
                if (thpoint[i][k].colhead=='rowSpan') {//셀에 rowspan이 있으면 값만큼 다음행에 대한 좌표값 배열 재설정
                    // startcol
                    // if (true) {}

                    for (var j = i+1; j < thpoint.length; j++) {//다음행(i+1) 부터 마지막 행까지 루프
                        // var tempArr = thpoint[j].splice(0,thpoint[i][k].startcol);
                        //시작컬럼번호(thpoint[i][k].startcol)에서 rowspan 값만큼 루프로 돌려서 배열밀기
                        for(var temp=0;temp<thpoint[i][k].rowspan-1;temp++){
                            // thpoint[j].unshift({startcol:0,endcol:0,colhead:0,rows:0,txts:0,Sinset:true})
                            // if (thpoint[i][k].txts=='아파트')
                            // break;
                            thpoint[j].splice([thpoint[i][k].startcol],0,{startcol:0,endcol:0,colhead:0,rows:0,txts:0,Sinset:true})
                            for (var ii = thpoint[i][k].startcol+1; ii<thpoint[j].length;  ii++) {
                                thpoint[j][ii].startcol++
                                thpoint[j][ii].endcol++
                            }
                            // if (thpoint[i][k].txts=='아파트')
                            break;
                        }
                        // startcol
                        // for (var kk = -1; kk < tempArr.length; ++kk) {
                        //  if (thpoint[j]!='undefined') {
                        //      thpoint[j].unshift(tempArr[kk])
                        //  };
                        // };
                    }
                    // break;
                    /*
                    for (var n = i+1; n < i+thpoint[i][k].rowspan; ++n) { //로우스판 이 걸리 이후 행에 대한 좌표값에서 배열 밀기
                        // if (thpoint[n]=='undefined') {
                            var tempArr = thpoint[n].splice(0,thpoint[i][k].startcol);
                            thpoint[n].unshift({startcol:0,endcol:0,colhead:0,rows:0,txts:0,Sinset:true})
                            for (var kk = -1; kk < tempArr.length; ++kk) {
                                thpoint[n].unshift(tempArr[kk])
                            };
                        // };
                    }
                    */
                }
            }
        }
        //colhead의 자식이 있는지 체크하여 th의 자식 수 구하기
        vs = thpoint.length;
        for(var i=0; i<thpoint.length; i++){//배열길이만큼 루프 = tr행만큼
            for(var k=0;k<thpoint[i].length;k++){//tr의 자식들 길이 만큼 루프
                if(thpoint[i][k].colhead && thpoint[i][k].Sinset==false){//colspan 2 이상인 경우
                    thpoint[i][k].child=0; //colhead의 자식 갯수 초기화
                    for(var a=1; a<thpoint.length; a++) { //
                        for (var b = 0; b <thpoint[a].length; b++) {
                            if (i<a && b>=thpoint[i][k].startcol && b<=thpoint[i][k].endcol) {
                                if (thpoint[a][b].Sinset==false ) {
                                    thpoint[i][k].child+=1;//colhead에 해당하는 자식 좌표 갯수 반영
                                }
                            }
                        }
                        // for (var b = thpoint[i][k].startcol; b <=thpoint[i][k].endcol; b++) {
                        //     if (thpoint[a][b].Sinset==false ) {
                        //         thpoint[i][k].child+=1;//colhead에 해당하는 자식 좌표 갯수 반영
                        //     }
                        // }
                    }
                }
            }
        }
        //summary 내용 생성.
        var vs = thpoint.length
        for(var i=0;i<vs;i++){
            for(var k=0;k<thpoint[i].length;k++){
                if(thpoint[i][k].colhead && thpoint[i][k].Sinset==false ){//colspan 2 이상인 경우
                    var lastchildCHK = thpoint[i][k].child;
                    var tempCHK = 0
                    summaryText += thpoint[i][k].txts;
                    if (thpoint[i][k].child) {
                         summaryText+='(';
                    };
                    for(var a=1;a<vs;a++) {
                        for (var b = 0; b <thpoint[a].length; b++) {
                        //for (var b = thpoint[i][k].startcol; b <=thpoint[i][k].endcol; b++) {
                            //colhead의 시작 좌표부터 종료 좌표까지 루프
                            if (i<a && b>=thpoint[i][k].startcol && b<=thpoint[i][k].endcol) {
                                if (thpoint[a][b].Sinset==false ) { //colhead에 해당하는 텍스트 서머리에 추가
                                    tempCHK+=1;
                                    if (tempCHK<lastchildCHK) {
                                        summaryText += thpoint[a][b].txts + ', ';
                                        thpoint[a][b].Sinset=true;
                                    }else{
                                        summaryText += thpoint[a][b].txts;
                                        thpoint[a][b].Sinset=true;
                                    };
                                }
                            }
                        }
                    }
                    if (i==thpoint[i].length) {
                        summaryText +=  ')';//마지막 인경우
                    } else if(thpoint[i][k].child){
                        summaryText +=  '), ';//자식이 잇는 경우
                    }else{
                        summaryText+=', ';//colhead가 자식이 없을경우
                    };
                }else if(thpoint[i][k].Sinset==false){
                    if (i==vs) {
                    } else{
                        summaryText += thpoint[i][k].txts + ', ';
                    };
                }
            }
        }
        summaryText = summaryText.substring(0,summaryText.length-2);
        summaryText+=' 정보를 포함하는 표';
        var doctype = document.documentElement.previousSibling;//
        if (doctype!=null && doctype.publicId == '') {//html5형식의 docType인지 확인
            var captionSummary = '<strong>' + $(this).find('caption').text() + '</strong>' + '<div><em>설명</em> <p>' + summaryText + '';
            $(this).find('caption').html(captionSummary);
        }else{
            $(this).find('caption').html($(this).find('caption').text() + ' : <span>' + summaryText + '</span>');
        }
    });
});