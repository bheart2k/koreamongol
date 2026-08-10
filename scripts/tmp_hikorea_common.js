var gfv_seLang = "";
/********************************************
@설명   	화면이 최초 호출될때, 달력 이벤트를 호출한다.
@작성일  	2014. 06. 05.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 06. 05.	              최초작성
*********************************************/
$(document).ready(function(){

	if( typeof calYn !== "undefined"){
		if(calYn != 'N'){
			gfn_initCalendar();
		} 
	} else {
		gfn_initCalendar();
	}
	$("body").prepend('<div id="dialog-message"></div>');
});

/********************************************
@함수명  	ComAjax
			- setUrl 		: 전송할 URL을 지정한다.
			- setCallBack 	: 콜백함수명을 지정한다.
			- addParam 		: 파라메터키와 값을 설정한다. 
			- tran 			: 입력값을 전송한다.
@설명   	Ajax 통신을 한다.
@인자   	String formId
@반환    	없음
@작성일  	2014. 06. 05.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 06. 05.	              최초작성
*********************************************/
var fv_jsonNmArray = new Array();
fv_comAjaxCallBack = "";
function ComAjax(opt_formId){
	
	this.formId = "";						// 폼 id
	this.url = "";							// 호출 url
	this.formId = opt_formId;
	this.param = "";						// 파라메터
	this.cmmParam = "TRAN_TYPE=ComAjax";	// 파라메터 구분
	this.dataType ="json";					// json 형식 
	this.async = false;						// 동기
	
	fv_jsonNmArray = new Array();

	this.setUrl = function setUrl(url){
		this.url = url;
	};
	this.getUrl = function getUrl(){
		return this.url;
	};
	this.setCallBack = function setCallBack(callBack){
		fv_comAjaxCallBack = callBack;
	};
	this.setDataType = function setDataType(value){
		this.dataType = value;
	};
	this.getDataType = function getDataType(){
		return this.dataType;
	};
	this.setAsync = function setAsync(value){
		this.async = value;
	};
	
	this.getAsync = function getAsync(){
		return this.async;
	};

	this.addParam = function addParam(key, value){ 
		this.param = this.param + "&" + key + "=" + value; 
	};
	
	this.getParam = function getParam(){
		return this.param;
	};
	
	this.tran = function tran(){
		if(gfn_isNull(this.formId) == false){

			var body = $("#"+this.formId);
			
			body.find(".btn_calendar").each(function(){
				var id = $(this).attr("id");
				$("#"+id).val(gfn_getDateVal(id));
			});
			
			this.param += "&" + $("#" + this.formId).serialize();
			
			body.find(".btn_calendar").each(function(){
				var id = $(this).attr("id");
				gfn_setDateVal(id, gfn_getDateVal(id));
			});
		}
		$.ajax({
			url : this.url,    
			type : "POST",   
			data : gfn_isNull(this.param) == true ? this.cmmParam : this.cmmParam + "&" + this.param,
			//dataType : this.dataType,
			async : this.async, 
			success : function(data, status) {
				
				// 간단히 확인할때 주석 풀고 alert창 띄우기
				//var result = "Json-Result:" + "\n" + JSON.stringify(data);
				//alert(result);
				
				gfn_LoadingBar(false);
				
				if(gfn_isNull(data._EXCEPTION) == true) {	// success
					if(typeof(fv_comAjaxCallBack) == "function"){
						fv_comAjaxCallBack(data);
					}else {
						eval(fv_comAjaxCallBack + "(data);");
					}
				}else {	// common error
					//data._EXCEPTION.ERROR_CODE
					//data._EXCEPTION.ERROR_MESSAGE
					if(data.ERROR_TYPE == "session") {	// session error
						var sessionErrorSubmit = new ComSubmit(); 
						sessionErrorSubmit.setUrl("/openSessionOut.pt");		
						sessionErrorSubmit.tran();
					}else{
						gfn_alert(data._EXCEPTION.ERROR_MESSAGE);
					}
				}
			}
		});
	};
}

/********************************************
@함수명  	ComAjax
			- setUrl 		: 전송할 URL을 지정한다.
			- setCallBack 	: 콜백함수명을 지정한다.
			- addParam 		: 파라메터키와 값을 설정한다. 
			- tran 			: 입력값을 전송한다.
@설명   	Ajax 통신을 한다.
@인자   	String formId
@반환    	없음
@작성일  	2014. 06. 05.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 06. 05.	              최초작성
*********************************************/
var fv_jsonNmArray2 = new Array();
fv_comAjaxCallBack2 = "";
function ComAjaxFile(opt_formId){
	
	this.formId = "";						// 폼 id
	this.url = "";							// 호출 url
	this.formId = opt_formId;
	this.param = "";						// 파라메터
	this.cmmParam = "TRAN_TYPE=ComAjax";	// 파라메터 구분
	this.dataType ="json";					// json 형식 
	this.async = false;						// 동기

	var frm = $("#"+this.formId);
	var formData = new FormData(frm[0]);

	fv_jsonNmArray2 = new Array();

	this.setUrl = function setUrl(url){
		this.url = url;
	};
	this.getUrl = function getUrl(){
		return this.url;
	};
	this.setCallBack = function setCallBack(callBack){
		fv_comAjaxCallBack2 = callBack;
	};
	this.setDataType = function setDataType(value){
		this.dataType = value;
	};
	this.getDataType = function getDataType(){
		return this.dataType;
	};
	this.setAsync = function setAsync(value){
		this.async = value;
	};
	this.getAsync = function getAsync(){
		return this.async;
	};
	this.addParam = function addParam(key, value){ 
		this.param = this.param + "&" + key + "=" + value; 
	};
	this.getParam = function getParam(){
		return this.param;
	};
	
	this.tran = function tran(){
		if(gfn_isNull(this.formId) == false){

			var body = $("#"+this.formId);
			
			body.find(".btn_calendar").each(function(){
				var id = $(this).attr("id");
				$("#"+id).val(gfn_getDateVal(id));
			});
			
			this.param += "&" + $("#" + this.formId).serialize();
			
			body.find(".btn_calendar").each(function(){
				var id = $(this).attr("id");
				gfn_setDateVal(id, gfn_getDateVal(id));
			});
		}
		$.ajax({
			url : this.url,    
			type : "POST",   
			enctype : "multipart/form-data",
			data : formData,
			dataType : "json",
			processData : false,
			contentType : false,
			async : false, 
			success : function(data, status) {
				gfn_LoadingBar(false);
				
				if(gfn_isNull(data._EXCEPTION) == true) {	// success
					if(typeof(fv_comAjaxCallBack) == "function"){
						fv_comAjaxCallBack2(data);
					}else {
						eval(fv_comAjaxCallBack2 + "(data);");
					}
				}else {	// common error
					if(data.ERROR_TYPE == "session") {	// session error
						var sessionErrorSubmit = new ComSubmit(); 
						sessionErrorSubmit.setUrl("/openSessionOut.pt");		
						sessionErrorSubmit.tran();
					}else{
						gfn_alert(data._EXCEPTION.ERROR_MESSAGE);
					}
				}
			}
		});
	};
}

/********************************************
@함수명  	ComSubmit
			- setUrl 		: 전송할 URL을 지정한다.
			- setTarget 	: 타켓을 지정한다.
			- addParam 		: 파라메터의 키와 값을 설정한다.	 
			- tran 			: 입력값을 전송한다.
@설명   	입력폼을 전송(submit)한다.
@인자   	String formId
@반환    	없음
@작성일  	2014. 06. 05.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 06. 05.	              최초작성
*********************************************/
function ComSubmit(opt_formId) {
	
	this.formId = gfn_isNull(opt_formId) == true ? "frmCmmAuth" : opt_formId;
	this.url = '';							// url
	this.target = '';						// target
	this.delElementId = '';
	this.param = "";						// 파라메터
	this.cmmParam = "TRAN_TYPE=ComSubmit";	// 파라메터 구분
	
	// url 세팅
	this.setUrl = function setUrl(url){
		this.url = url;
	};
	
	// param 세팅
	this.addParam = function addParam(key, value){
		if(this.formId == "frmCmmAuth"){
			$("#"+this.formId).find("input[name=" + key + "]").remove();	// 추가할 key값이 존재하면 삭제 후 추가
			$("#"+this.formId).append($("<input type='hidden' name='"+key+"' id='"+key+"' value='"+value+"' >"));

			if(gfn_isNull(this.delElementId) == true){						//팝업 호출시 해당 부모창에 남겨져 있는 input을 삭제하기 위해 저장
				this.delElementId = key;
			}else{
				this.delElementId = this.delElementId+":"+ key;
			}
		}else{
			if(gfn_isNull($("#"+this.formId).find($("#"+key)).attr("id")) == false){
				$("#"+this.formId).find($("#"+key)).remove();
			}
			$("#"+this.formId).append("<input type='hidden' id='"+key+"' name='"+key+"' value='"+value+"' />");
		}
	};
	
	// 타켓 세팅
	this.setTarget = function setTarget(target){
		this.target = target;
	};
	
	// 메뉴 Tran
	/*
	this.menuTran = function menuTran(menuId){
		this.url = "/openPage.do?MENU_ID=" + menuId;
		this.tran();
	};
	*/
	
	// 일반 Submit Tran
	this.tran = function tran(){
		var body = $("#" + this.formId);
		
		body.find(".btn_calendar").each(function(){
			var id = $(this).attr("id");
			$("#"+id).val(gfn_getDateVal(id));
		});
		
		// 공통 파라메터 세팅
		var cmmParamArray = this.cmmParam.split("=");
		
		$("#"+this.formId).find("input[name=" + cmmParamArray[0] + "]").remove();	// 기존 input 삭제
		$("#"+this.formId).append("<input type='hidden' id='"+cmmParamArray[0]+"' name='"+cmmParamArray[0]+"' value='"+cmmParamArray[1]+"' />");
		
		this.delElementId = gfn_isNull(this.delElementId) == true ? cmmParamArray[0] : this.delElementId + ":" + cmmParamArray[0]; // 삭제 리스트에 추가
		//target 설정
		$("#"+this.formId)[0].target = this.target;
		$("#"+this.formId)[0].action = this.url; 		// url 설정
		$("#"+this.formId)[0].method = "post";
		$("#"+this.formId)[0].submit();					// submit

		// 타겟 & 파라메터 초기화
		this.target = '';
		var delElementIdList = this.delElementId.split(":");

		for(var i=0; i<delElementIdList.length; i++){
			var delElementId = delElementIdList[i];
			$("#"+this.formId+" input[id="+delElementId+"]").remove();
		}
	};
}

/********************************************
@함수명  	gfn_openPopUp
@설명   	팝업을 호출한다.
@인자   	String strFile, String strPopName, Object objParams, String strWidth, String strHeight
@입력형태	strFile : /sample/samplePop 등의 호출할 파일 경로
			strPopName : 팝업명 
			objParams : 팝업에 전달해야할 인자값 object
			strWidth : 팝업 넓이
			strHeight : 팝업 높이
@반환    	없음
@작성일  	2014. 5. 29.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 29.	              최초작성
*********************************************/
function gfn_openPopUp(strFile, strPopName, objParams, strWidth, strHeight) {
	
	var popupSubmit = new ComSubmit();
	popupSubmit.setUrl("/commonOpenPopUp.pt");		//이동할 URL설정
	
	strPopName = gfn_trim(strPopName);
	popupSubmit.setTarget(strPopName);		//페이지를 이동시킬 target 설정
	
	if(gfn_isNull(objParams) == false){		//전달할 파라미터들을 셋팅
		$.each(objParams, function(key, val){
			popupSubmit.addParam(key, val);
		});
	}

	popupSubmit.addParam("file", strFile);	//화면 호출할 파일 (ex: /sample/sampleList)

	//var strTop = (screen.availHeight/2);
	var strTop = 50;
	//var strLeft = (screen.availWidth/2);
	var strLeft = 50;
	
	var sFeatures = "width=" +strWidth+ ",height=" +strHeight + ",left=" + strLeft + ",top=" + strTop + ",scrollbars=yes, location=no";
	
	//팝업 호출
	window.open("", strPopName, sFeatures);
	//팝업에 해당 url로 submit 시킴
	popupSubmit.tran();
}

/********************************************
@함수명  	gfn_alert
@설명   	공통 alert 출력 함수
@인자   	string strMessage : 메시지
        funcPost : 실행값
@작성일  	2014. 7. 25.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 25.	              최초작성
*********************************************/
var fv_funcAlertPost = null;
function gfn_alert(strMessage, funcPost){
	
	// callback 함수 변역변수에 설정
	if(gfn_isNull(funcPost) == false){
		fv_funcAlertPost = funcPost;
	}else{
		fv_funcAlertPost = null;
	}
	
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	dialogHtml += 	'<table border="0" cellpadding="1" cellspacing="0" class="board_alert01">';
	dialogHtml += 		'<colgroup>';
	dialogHtml += 			'<col style="width:15%" />';				
	dialogHtml += 			'<col style="width:auto" />';
	dialogHtml += 		'</colgroup>';
	dialogHtml +=		'<tr>';
	dialogHtml += 			'<td scope="row"><img src="/common/images/ptg/common/ico_alert_01.gif" alt="" /></td>';
	dialogHtml += 			'<td>' + strMessage + '</td>';
	dialogHtml +=		'</tr>';
	dialogHtml += 	'</table>';	
	dialogHtml += '</div>';
	dialogHtml += '<div class="alert_btn01">';		
	dialogHtml += 	'<a href="#this" id="alertClose" class="btn_blue_b" >';
	dialogHtml += (gfv_seLang == 'KR' ? '확인' : (gfv_seLang == 'EN' ? "OK" : (gfv_seLang == 'CH' ? '确认' : '확인'))); 
	dialogHtml += 	'</a>';
	dialogHtml += '</div>';

	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'HIKOREA',
		position:['center', 200],
		width:400,			
		zIndex:99,
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});		
	$("#dialog-message").html(dialogHtml);
	$("#dialog-message").dialog('open');
	$('#alertClose').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcAlertPost) == false){
			fv_funcAlertPost();
			fv_funcAlertPost = null;
		}
	});
}

function gfn_alert2(strMessage, funcPost){
	
	// callback 함수 변역변수에 설정
	if(gfn_isNull(funcPost) == false){
		fv_funcAlertPost = funcPost;
	}else{
		fv_funcAlertPost = null;
	}
	
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	dialogHtml += 	'<table border="0" cellpadding="1" cellspacing="0" class="board_alert01">';
	dialogHtml += 		'<colgroup>';
	dialogHtml += 			'<col style="width:15%" />';				
	dialogHtml += 			'<col style="width:auto" />';
	dialogHtml += 		'</colgroup>';
	dialogHtml +=		'<tr>';
	dialogHtml += 			'<td scope="row"><img src="/common/images/ptg/common/ico_alert_01.gif" alt="" /></td>';
	dialogHtml += 			'<td align="center">' + strMessage + '</td>';
	dialogHtml +=		'</tr>';
	dialogHtml += 	'</table>';	
	dialogHtml += '</div>';
	dialogHtml += '<div class="alert_btn01">';		
	dialogHtml += 	'<a href="#this" id="alertClose" class="btn_blue_b" >';
	dialogHtml += (gfv_seLang == 'KR' ? '확인' : (gfv_seLang == 'EN' ? "OK" : (gfv_seLang == 'CH' ? '确认' : '확인'))); 
	dialogHtml += 	'</a>';
	dialogHtml += '</div>';
	
	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'HIKOREA',
		position:['center', 200],
		width:600,			
		zIndex:99,
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});		
	$("#dialog-message").html(dialogHtml);
	$("#dialog-message").dialog('open');
	$('#alertClose').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcAlertPost) == false){
			fv_funcAlertPost();
			fv_funcAlertPost = null;
		}
	});
}

function gfn_alert_noimg(strMessage, funcPost){
	
	// callback 함수 변역변수에 설정
	if(gfn_isNull(funcPost) == false){
		fv_funcAlertPost = funcPost;
	}else{
		fv_funcAlertPost = null;
	}
	
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	dialogHtml += 	'<table border="0" cellpadding="1" cellspacing="0" class="board_alert01">';
	dialogHtml += 		'<colgroup>';				
	dialogHtml += 			'<col style="width:auto" />';
	dialogHtml += 		'</colgroup>';
	dialogHtml +=		'<tr>';
	dialogHtml += 			'<td style="color:red">' + strMessage + '</td>';
	dialogHtml +=		'</tr>';
	dialogHtml += 	'</table>';	
	dialogHtml += '</div>';
	dialogHtml += '<div class="alert_btn01">';		
	dialogHtml += 	'<a href="#this" id="alertClose" class="btn_blue_b" >';
	dialogHtml += (gfv_seLang == 'KR' ? '확인' : (gfv_seLang == 'EN' ? "OK" : (gfv_seLang == 'CH' ? '确认' : '확인'))); 
	dialogHtml += 	'</a>';
	dialogHtml += '</div>';

	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'HIKOREA',
		position:['center', 200],
		width:400,			
		zIndex:99,
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});		
	$("#dialog-message").html(dialogHtml);
	$("#dialog-message").dialog('open');
	$('#alertClose').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcAlertPost) == false){
			fv_funcAlertPost();
			fv_funcAlertPost = null;
		}
	});
}

function gfn_alert_noimg_black(strMessage, funcPost){
	
	// callback 함수 변역변수에 설정
	if(gfn_isNull(funcPost) == false){
		fv_funcAlertPost = funcPost;
	}else{
		fv_funcAlertPost = null;
	}
	
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	dialogHtml += 	'<table border="0" cellpadding="1" cellspacing="0" class="board_alert01">';
	dialogHtml += 		'<colgroup>';				
	dialogHtml += 			'<col style="width:auto" />';
	dialogHtml += 		'</colgroup>';
	dialogHtml +=		'<tr>';
	dialogHtml += 			'<td>' + strMessage + '</td>';
	dialogHtml +=		'</tr>';
	dialogHtml += 	'</table>';	
	dialogHtml += '</div>';
	dialogHtml += '<div class="alert_btn01">';		
	dialogHtml += 	'<a href="#this" id="alertClose" class="btn_blue_b" >';
	dialogHtml += (gfv_seLang == 'KR' ? '확인' : (gfv_seLang == 'EN' ? "OK" : (gfv_seLang == 'CH' ? '确认' : '확인'))); 
	dialogHtml += 	'</a>';
	dialogHtml += '</div>';

	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'HIKOREA',
		position:['center', 200],
		width:400,			
		zIndex:99,
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});		
	$("#dialog-message").html(dialogHtml);
	$("#dialog-message").dialog('open');
	$('#alertClose').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcAlertPost) == false){
			fv_funcAlertPost();
			fv_funcAlertPost = null;
		}
	});
}



function modalLoding(flag){
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	dialogHtml += '<img src="/images/common/etc/loading.gif" style="border:double 4px #ccc;">';
	dialogHtml += '</div>';
	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'HIKOREA',
		position:['center', 400],
		width:360,			
		zIndex:99,
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});
	$("#dialog-message").html(dialogHtml);
	
	if(flag){
		$("#dialog-message").dialog('open');
	}else{
		$("#dialog-message").dialog('close');
	}
}

/********************************************
@함수명  	gfn_confirm
@설명   	공통 confirm 출력 함수
@인자   	string strMessage : 메시지
        funcTrue : 확인 시 실행값
        funcFalse : 취소 시 실행값
        confirmBtnNm : 확인버튼 명
@작성일  	2014. 7. 25.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 25.	              최초작성
*********************************************/
var fv_funcConfirmPostTrue = null;	// confirm true시 호출될 함수를 담는 전역변수
var fv_funcConfirmPostFalse = null;	// confirm false시 호출될 함수를 담는 전역변수
function gfn_confirm(strMessage, funcTrue, funcFalse, confirmBtnNm){
	
	// callback 함수 변역변수에 설정
	if(gfn_isNull(funcTrue) == false){
		fv_funcConfirmPostTrue = funcTrue;
	}else{
		fv_funcConfirmPostTrue = null;
	}
	
	if(gfn_isNull(funcFalse) == false){
		fv_funcConfirmPostFalse = funcFalse;
	}else{
		fv_funcConfirmPostFalse = null;
	}
	
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	dialogHtml += 	'<table border="0" cellpadding="1" cellspacing="0" class="board_alert01">';
	dialogHtml += 		'<colgroup>';
	dialogHtml += 			'<col style="width:18%" />';				
	dialogHtml += 			'<col style="width:auto" />';
	dialogHtml += 		'</colgroup>';
	dialogHtml += 		'<tr>';
	dialogHtml += 			'<td scope="row"><img src="/common/images/ptg/common/ico_alert_01.gif" alt="" /></td>';
	dialogHtml += 			'<td>' + strMessage + '</td>';
	dialogHtml += 		'</tr>';
	dialogHtml += 	'</table>';	
	dialogHtml += '</div>';
	dialogHtml += '<div class="alert_btn01">';		
	dialogHtml += 	'<a href="#this" id="confirmTrue" class="btn_blue_b">';
	if(confirmBtnNm != undefined){
		dialogHtml += confirmBtnNm;
	}else{
		dialogHtml += (gfv_seLang == 'KR' ? '확인' : (gfv_seLang == 'EN' ? "OK" : (gfv_seLang == 'CH' ? '确认' : '확인')));
	}
	dialogHtml += 	'</a>';
	dialogHtml += 	'<a href="#this" id="confirmFalse" class="btn_green_b">';
	dialogHtml += (gfv_seLang == 'KR' ? '취소' : (gfv_seLang == 'EN' ? "Cancel" : (gfv_seLang == 'CH' ? '取消' : '취소')));
	dialogHtml += 	'</a>';
	dialogHtml += '</div>';

	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'HIKOREA',
		position:['center', 200],
		width:400,		
		zIndex:99,
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});		
	$("#dialog-message").html(dialogHtml);
	$("#dialog-message").dialog('open');
	$('#confirmTrue').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostTrue) == false){
			
			// confirm true의 callback 호출
			fv_funcConfirmPostTrue();
			
			// callback 초기화		
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostFalse = null;
		}
	});
	$('#confirmFalse').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostFalse) == false){
			
			// confirm false의 callback 호출
			fv_funcConfirmPostFalse();
			
			// callback 초기화
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostFalse = null;
		}
	});
}

/********************************************
@함수명  	gfn_confirm_resv
@설명   	공통 confirm 출력 함수
@인자   	string strMessage : 메시지
        funcTrue : 확인 시 실행값
        funcFalse : 취소 시 실행값
        confirmBtnNm : 확인버튼 명
@작성일  	2014. 7. 25.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 25.	              최초작성
*********************************************/
var fv_resv_funcConfirmPostTrue = null;	// confirm true시 호출될 함수를 담는 전역변수
var fv_resv_funcConfirmPostFalse = null;	// confirm false시 호출될 함수를 담는 전역변수
function gfn_confirm_resv(strMessage, funcTrue, funcFalse, confirmBtnNm){
	
	// callback 함수 변역변수에 설정
	if(gfn_isNull(funcTrue) == false){
		fv_resv_funcConfirmPostTrue = funcTrue;
	}else{
		fv_resv_funcConfirmPostTrue = null;
	}
	
	if(gfn_isNull(funcFalse) == false){
		fv_resv_funcConfirmPostFalse = funcFalse;
	}else{
		fv_resv_funcConfirmPostFalse = null;
	}
	
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	dialogHtml += 	'<table border="0" cellpadding="1" cellspacing="0" class="board_alert01">';
	dialogHtml += 		'<colgroup>';
	dialogHtml += 			'<col style="width:18%" />';				
	dialogHtml += 			'<col style="width:auto" />';
	dialogHtml += 		'</colgroup>';
	dialogHtml += 		'<tr>';
	dialogHtml += 			'<td scope="row"><img src="/common/images/ptg/common/ico_alert_01.gif" alt="" /></td>';
	dialogHtml += 			'<td>' + strMessage + '</td>';
	dialogHtml += 		'</tr>';
	dialogHtml += 	'</table>';	
	dialogHtml += '</div>';
	dialogHtml += '<div class="alert_btn01">';		
	dialogHtml += 	'<a href="#this" id="confirmFalse" class="btn_green_b">';
	dialogHtml += (gfv_seLang == 'KR' ? '이전' : (gfv_seLang == 'EN' ? "Go back to previous page" : (gfv_seLang == 'CH' ? '返回' : '이전')));
	dialogHtml += 	'</a>';
	dialogHtml += 	'<a href="#this" id="confirmTrue" class="btn_blue_b">';
	if(confirmBtnNm != undefined){
		dialogHtml += confirmBtnNm;
	}else{
		dialogHtml += (gfv_seLang == 'KR' ? '확인' : (gfv_seLang == 'EN' ? "OK" : (gfv_seLang == 'CH' ? '确认' : '확인')));
	}
	dialogHtml += 	'</a>';
	
	dialogHtml += '</div>';

	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'HIKOREA',
		position:['center', 200],
		width:400,		
		zIndex:99,
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});		
	$("#dialog-message").html(dialogHtml);
	$("#dialog-message").dialog('open');
	$('#confirmTrue').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_resv_funcConfirmPostTrue) == false){
			
			// confirm true의 callback 호출
			fv_resv_funcConfirmPostTrue();
			
			// callback 초기화		
			fv_resv_funcConfirmPostTrue = null;
			fv_resv_funcConfirmPostFalse = null;
		}
	});
	$('#confirmFalse').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_resv_funcConfirmPostFalse) == false){
			
			// confirm false의 callback 호출
			fv_resv_funcConfirmPostFalse();
			
			// callback 초기화
			fv_resv_funcConfirmPostTrue = null;
			fv_resv_funcConfirmPostFalse = null;
		}
	});
}

/********************************************
@설명   	달력 이벤트를 호출한다.
@작성일  	2014. 07. 02.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 07. 02.	              최초작성
*********************************************/
function gfn_initCalendar(){
	$(".btn_calendar").each(function(){
		$(this).on("click",function(){
			gfn_openBtnCalendar($(this).attr("id"));
		});
	});
	$(".btn_calendar").trigger("click");
}

/********************************************
@함수명  	gfn_disableElements
@설명   	신청이후의 상태에서는 모든 신청항목을 disabled,readonly로 변경 
@예시    fn_disableElements($("select,input:radio,input:text,input:checkbox,input:file"));
@인자		없음
@반환		없음
@작성일  	2014. 07. 11.
@작성자  	성명준
@변경일			변경자        변경내역 
2014. 07. 11.	성명준        최초작성
*********************************************/
function gfn_disableElements(arrObj){
	
	for(var index=0; index<arrObj.length; index++){
		var typeName = arrObj[index].type;
		var obj = $(arrObj[index]);
		
		if((typeName == "select-one") || (typeName == "radio") || (typeName == "checkbox") || typeName == "file" ){
			obj.attr("disabled", "disabled");
		}else if(typeName == "text"){
			obj.attr("readonly", "readonly");
			obj.addClass("readonly");
		}			
	}
}

/********************************************
@함수명  	gfn_disableElementsAll
@설명   	신청이후의 상태에서는 모든 신청항목을 disabled,readonly로 변경 
@예시    fn_disableElements($("select,input:radio,input:text,input:checkbox,input:file"));
@인자		없음
@반환		없음
@작성일  	2014. 07. 11.
@작성자  	성명준
@변경일			변경자        변경내역 
2014. 07. 11.	성명준        최초작성
*********************************************/
function gfn_disableElementsAll(arrObj){
	
	for(var index=0; index<arrObj.length; index++){
		var typeName = arrObj[index].type;
		var obj = $(arrObj[index]);
		
		if((typeName == "select-one") || (typeName == "radio") || (typeName == "checkbox") || typeName == "file" ||  typeName == "password"){
			obj.attr("disabled", "disabled");
		}else if(typeName == "text"){
			obj.attr("readonly", "readonly");
			obj.addClass("readonly");
		}			
	}
}

/********************************************
@함수명  	gfn_clearElements
@설명   	신청이후의 상태에서는 모든 신청항목을 "" 로 변경 
@예시    gfn_clearElements($("select,input:radio,input:text,input:checkbox,input:file"));
@인자		없음
@반환		없음
@작성일  	2014. 07. 11.
@작성자  	성명준
@변경일			변경자        변경내역 
2014. 07. 11.	성명준        최초작성
*********************************************/
function gfn_clearElements(arrObj){
	
	for(var index=0; index<arrObj.length; index++){
		var typeName = arrObj[index].type;
		var obj = $(arrObj[index]);
		
		if((typeName == "radio") || (typeName == "checkbox")){
			obj.attr("checked", false);
		}else if(typeName == "text" || typeName == "password" || typeName == "file" || typeName == "select-one"){
			obj.val("");
		}			
	}
}

/********************************************
@함수명  	gfn_reportClip
@설명   	신청이후의 상태에서는 모든 신청항목을 "" 로 변경 
@예시    
@인자		없음
@반환		없음
@작성일  	2014. 07. 11.
@작성자  	성명준
@변경일			변경자        변경내역 
2014. 07. 11.	성명준        최초작성
*********************************************/
function gfn_reportClip(inputParams, objParams){
	
	var comAjax = new ComAjax();		 
	comAjax.setUrl("/report/reportDocPrintR.pt");
	if(gfn_isNull(inputParams) == false){		
		$.each(inputParams, function(key, val){
			comAjax.addParam(key, val);
		});
	}
	comAjax.setCallBack("gfn_ReportClipCallBack");
	comAjax.tran();
}
function gfn_ReportClipCallBack(data){
	
	var reportSubmit = new ComSubmit();
	reportSubmit.setUrl("/openReportPopup.pt");
	var popName = gfn_trim(data.popName);
	reportSubmit.setTarget(popName);
	reportSubmit.addParam("objTitle", data.reportTitle);
	reportSubmit.addParam("objParams", data.objParams);
	reportSubmit.addParam("crfFile", data.crfFile);
	reportSubmit.addParam("xmlData", data.rexpertResult);
	var strTop = 50;
	var strLeft = 50;
	var strWidth = 1000;
	var strHeight = 700;
	var sFeatures = "width=" +strWidth+ ",height=" +strHeight + ",left=" + strLeft + ",top=" + strTop + ", scrollbars=yes, location=no";

	window.open("", popName, sFeatures);
	reportSubmit.tran();
}


/********************************************
@함수명  	gfn_LoadingBar
@설명   	로딩바
@인자   	String closeCheck : true(열기), false(닫기)
@작성일  	2014. 6. 20.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 6. 20.	              최초작성
*********************************************/
function gfn_LoadingBar(closeCheck){
	if(closeCheck == true){
		var wh = $(window).height()/3;
		$('.loading_bar').css('padding-top',wh);
		$('.loading_bar').css("display", "block");	
	}else{
		$('.loading_bar').fadeOut(300);
	}
}

function gfn_GetByteString(str){
	var byte = 0;
	for(var i=0; i<str.length; i++){
		(str.charCodeAt(i)>127) ? byte += 2 : byte ++;
	}
	return byte;
}

function gfn_setLocale(loc){
	var localeSubmit = new ComSubmit();
	localeSubmit.setUrl("/Main.pt");
	localeSubmit.addParam("locale", loc);
	localeSubmit.tran();
}

/********************************************
@함수명  	gfn_confirm2(등록외국인의 체류자격변경허가 H2전용)
@설명   	공통 confirm2 출력 함수
@인자   	string strMessage : 메시지
        funcTrue : 확인 시 실행값
        funcFalse : 취소 시 실행값
        confirmBtnNm : 확인버튼 명
@작성일  	2023. 7. 18.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 7. 25.	              최초작성
2025. 4. 03.                  수정
*********************************************/
var fv_funcConfirmPostTrue = null;	// confirm true시 호출될 함수를 담는 전역변수
var fv_funcConfirmPostTrue2 = null;	// confirm true시 호출될 함수를 담는 전역변수
var fv_funcConfirmPostFalse = null;	// confirm false시 호출될 함수를 담는 전역변수
function gfn_confirm2(strMessage, funcTrue,funcTrue2, funcFalse, confirmBtnNm){
	
	// callback 함수 변역변수에 설정
	if(gfn_isNull(funcTrue) == false){
		fv_funcConfirmPostTrue = funcTrue;
	}else{
		fv_funcConfirmPostTrue = null;
	}
	
	if(gfn_isNull(funcTrue2) == false){
		fv_funcConfirmPostTrue2 = funcTrue2;
	}else{
		fv_funcConfirmPostTrue2 = null;
	}
	
	if(gfn_isNull(funcFalse) == false){
		fv_funcConfirmPostFalse = funcFalse;
	}else{
		fv_funcConfirmPostFalse = null;
	}
	
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	dialogHtml += 	'<table border="0" cellpadding="1" cellspacing="0" class="board_alert01">';
	dialogHtml += 		'<colgroup>';
	dialogHtml += 			'<col style="width:18%" />';				
	dialogHtml += 			'<col style="width:auto" />';
	dialogHtml += 		'</colgroup>';
	dialogHtml += 		'<tr>';
	dialogHtml += 			'<td scope="row"><img src="/common/images/ptg/common/ico_alert_01.gif" alt="" /></td>';
	dialogHtml += 			'<td>' + strMessage + '</td>';
	dialogHtml += 		'</tr>';
	dialogHtml += 	'</table>';	
	dialogHtml += '</div>';
	dialogHtml += '<div class="alert_btn01">';		
	dialogHtml += 	'<a href="#this" id="confirmTrue" class="btn_blue_b">';
	if(confirmBtnNm != undefined){
		dialogHtml += confirmBtnNm;
	}else{
		dialogHtml += (gfv_seLang == 'KR' ? 'E-7-4(E-7-4R)' : (gfv_seLang == 'EN' ? "E-7-4(E-7-4R)" : (gfv_seLang == 'CH' ? 'E-7-4(E-7-4R)' : 'E-7-4(E-7-4R)')));
	}
	dialogHtml += 	'</a>';
	dialogHtml += 	'<a href="#this" id="confirmTrue2" class="btn_blue_b">';
	dialogHtml += (gfv_seLang == 'KR' ? '탑티어(Top-Tier)' : (gfv_seLang == 'EN' ? "탑티어(Top-Tier)" : (gfv_seLang == 'CH' ? '탑티어(Top-Tier)' : '탑티어(Top-Tier)')));
	dialogHtml += 	'</a>';
	dialogHtml += 	'<a href="#this" id="confirmFalse" class="btn_green_b">';
	dialogHtml += (gfv_seLang == 'KR' ? 'F-4' : (gfv_seLang == 'EN' ? "F-4" : (gfv_seLang == 'CH' ? 'F-4' : 'F-4')));
	dialogHtml += 	'</a>';
	dialogHtml += '</div>';

	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'HIKOREA',
		position:['center', 200],
		width:400,		
		zIndex:99,
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});		
	$("#dialog-message").html(dialogHtml);
	$("#dialog-message").dialog('open');
	$('#confirmTrue').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostTrue) == false){
			
			// confirm true의 callback 호출
			fv_funcConfirmPostTrue();
			
			// callback 초기화		
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostTrue2 = null;
			fv_funcConfirmPostFalse = null;
		}
	});
	
	$('#confirmTrue2').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostTrue2) == false){
			
			// confirm true의 callback 호출
			fv_funcConfirmPostTrue2();
			
			// callback 초기화		
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostTrue2 = null;
			fv_funcConfirmPostFalse = null;
		}
	});
	
	$('#confirmFalse').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostFalse) == false){
			
			// confirm false의 callback 호출
			fv_funcConfirmPostFalse();
			
			// callback 초기화
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostFalse = null;
		}
	});
}

/********************************************
@함수명  	gfn_confirm4(등록외국인의 체류자격변경허가 E9전용)
@설명   	공통 confirm4 출력 함수
@인자   	string strMessage : 메시지
        funcTrue : 확인 시 실행값
        funcFalse : 취소 시 실행값
        confirmBtnNm : 확인버튼 명
@작성일  	2025. 04. 07.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2025. 04. 07.	              최초작성
*********************************************/
var fv_funcConfirmPostTrue = null;	// confirm true시 호출될 함수를 담는 전역변수
var fv_funcConfirmPostFalse = null;	// confirm false시 호출될 함수를 담는 전역변수
function gfn_confirm4(strMessage, funcTrue, funcFalse, confirmBtnNm){
	
	// callback 함수 변역변수에 설정
	if(gfn_isNull(funcTrue) == false){
		fv_funcConfirmPostTrue = funcTrue;
	}else{
		fv_funcConfirmPostTrue = null;
	}
	
	if(gfn_isNull(funcFalse) == false){
		fv_funcConfirmPostFalse = funcFalse;
	}else{
		fv_funcConfirmPostFalse = null;
	}
	
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	dialogHtml += 	'<table border="0" cellpadding="1" cellspacing="0" class="board_alert01">';
	dialogHtml += 		'<colgroup>';
	dialogHtml += 			'<col style="width:18%" />';				
	dialogHtml += 			'<col style="width:auto" />';
	dialogHtml += 		'</colgroup>';
	dialogHtml += 		'<tr>';
	dialogHtml += 			'<td scope="row"><img src="/common/images/ptg/common/ico_alert_01.gif" alt="" /></td>';
	dialogHtml += 			'<td>' + strMessage + '</td>';
	dialogHtml += 		'</tr>';
	dialogHtml += 	'</table>';	
	dialogHtml += '</div>';
	dialogHtml += '<div class="alert_btn01">';		
	dialogHtml += 	'<a href="#this" id="confirmTrue" class="btn_blue_b">';
	if(confirmBtnNm != undefined){
		dialogHtml += confirmBtnNm;
	}else{
		dialogHtml += (gfv_seLang == 'KR' ? 'E-7-4(E-7-4R)' : (gfv_seLang == 'EN' ? "E-7-4(E-7-4R)" : (gfv_seLang == 'CH' ? 'E-7-4(E-7-4R)' : 'E-7-4(E-7-4R)')));
	}
	dialogHtml += 	'</a>';
	dialogHtml += 	'<a href="#this" id="confirmFalse" class="btn_green_b">';
	dialogHtml += (gfv_seLang == 'KR' ? '탑티어(Top-Tier)' : (gfv_seLang == 'EN' ? "탑티어(Top-Tier)" : (gfv_seLang == 'CH' ? '탑티어(Top-Tier)' : '탑티어(Top-Tier)')));
	dialogHtml += 	'</a>';
	dialogHtml += '</div>';

	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'HIKOREA',
		position:['center', 200],
		width:400,		
		zIndex:99,
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});		
	$("#dialog-message").html(dialogHtml);
	$("#dialog-message").dialog('open');
	$('#confirmTrue').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostTrue) == false){
			
			// confirm true의 callback 호출
			fv_funcConfirmPostTrue();
			
			// callback 초기화		
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostFalse = null;
		}
	});

	$('#confirmFalse').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostFalse) == false){
			
			// confirm false의 callback 호출
			fv_funcConfirmPostFalse();
			
			// callback 초기화
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostFalse = null;
		}
	});
}

/********************************************
@함수명  	gfn_confirm5(등록외국인의 체류자격변경허가 E10전용)
@설명   	공통 confirm5 출력 함수
@인자   	string strMessage : 메시지
        funcTrue : 확인 시 실행값
        funcFalse : 취소 시 실행값
        confirmBtnNm : 확인버튼 명
@작성일  	2025. 04. 07.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2025. 04. 07.	              최초작성
*********************************************/
var fv_funcConfirmPostTrue = null;	// confirm true시 호출될 함수를 담는 전역변수
var fv_funcConfirmPostFalse = null;	// confirm false시 호출될 함수를 담는 전역변수
function gfn_confirm5(strMessage, funcTrue, funcFalse, confirmBtnNm){
	
	// callback 함수 변역변수에 설정
	if(gfn_isNull(funcTrue) == false){
		fv_funcConfirmPostTrue = funcTrue;
	}else{
		fv_funcConfirmPostTrue = null;
	}
	
	if(gfn_isNull(funcFalse) == false){
		fv_funcConfirmPostFalse = funcFalse;
	}else{
		fv_funcConfirmPostFalse = null;
	}
	
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	dialogHtml += 	'<table border="0" cellpadding="1" cellspacing="0" class="board_alert01">';
	dialogHtml += 		'<colgroup>';
	dialogHtml += 			'<col style="width:18%" />';				
	dialogHtml += 			'<col style="width:auto" />';
	dialogHtml += 		'</colgroup>';
	dialogHtml += 		'<tr>';
	dialogHtml += 			'<td scope="row"><img src="/common/images/ptg/common/ico_alert_01.gif" alt="" /></td>';
	dialogHtml += 			'<td>' + strMessage + '</td>';
	dialogHtml += 		'</tr>';
	dialogHtml += 	'</table>';	
	dialogHtml += '</div>';
	dialogHtml += '<div class="alert_btn01">';		
	dialogHtml += 	'<a href="#this" id="confirmTrue" class="btn_blue_b">';
	if(confirmBtnNm != undefined){
		dialogHtml += confirmBtnNm;
	}else{
		dialogHtml += (gfv_seLang == 'KR' ? 'E-7-4(E-7-4R)' : (gfv_seLang == 'EN' ? "E-7-4(E-7-4R)" : (gfv_seLang == 'CH' ? 'E-7-4(E-7-4R)' : 'E-7-4(E-7-4R)')));
	}
	dialogHtml += 	'</a>';
	dialogHtml += 	'<a href="#this" id="confirmFalse" class="btn_green_b">';
	dialogHtml += (gfv_seLang == 'KR' ? '탑티어(Top-Tier)' : (gfv_seLang == 'EN' ? "탑티어(Top-Tier)" : (gfv_seLang == 'CH' ? '탑티어(Top-Tier)' : '탑티어(Top-Tier)')));
	dialogHtml += 	'</a>';
	dialogHtml += '</div>';

	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'HIKOREA',
		position:['center', 200],
		width:400,		
		zIndex:99,
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});		
	$("#dialog-message").html(dialogHtml);
	$("#dialog-message").dialog('open');
	$('#confirmTrue').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostTrue) == false){
			
			// confirm true의 callback 호출
			fv_funcConfirmPostTrue();
			
			// callback 초기화		
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostFalse = null;
		}
	});

	$('#confirmFalse').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostFalse) == false){
			
			// confirm false의 callback 호출
			fv_funcConfirmPostFalse();
			
			// callback 초기화
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostFalse = null;
		}
	});
}


/********************************************
@함수명  	gfn_confirm7(등록외국인의 체류자격변경허가 D4전용)
@설명   	공통 confirm7 출력 함수
@인자   	string strMessage : 메시지
        funcTrue : 확인 시 실행값
        funcFalse : 취소 시 실행값
        confirmBtnNm : 확인버튼 명
@작성일  	2025. 04. 07.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2025. 04. 07.	              최초작성
*********************************************/
var fv_funcConfirmPostTrue = null;	// confirm true시 호출될 함수를 담는 전역변수
var fv_funcConfirmPostFalse = null;	// confirm false시 호출될 함수를 담는 전역변수
function gfn_confirm7(strMessage, funcTrue, funcFalse, confirmBtnNm){
	
	// callback 함수 변역변수에 설정
	if(gfn_isNull(funcTrue) == false){
		fv_funcConfirmPostTrue = funcTrue;
	}else{
		fv_funcConfirmPostTrue = null;
	}
	
	if(gfn_isNull(funcFalse) == false){
		fv_funcConfirmPostFalse = funcFalse;
	}else{
		fv_funcConfirmPostFalse = null;
	}
	
	var dialogHtml 	= '';
	dialogHtml += '<div class="alert_con">';
	dialogHtml += 	'<table border="0" cellpadding="1" cellspacing="0" class="board_alert01">';
	dialogHtml += 		'<colgroup>';
	dialogHtml += 			'<col style="width:18%" />';				
	dialogHtml += 			'<col style="width:auto" />';
	dialogHtml += 		'</colgroup>';
	dialogHtml += 		'<tr>';
	dialogHtml += 			'<td scope="row"><img src="/common/images/ptg/common/ico_alert_01.gif" alt="" /></td>';
	dialogHtml += 			'<td>' + strMessage + '</td>';
	dialogHtml += 		'</tr>';
	dialogHtml += 	'</table>';	
	dialogHtml += '</div>';
	dialogHtml += '<div class="alert_btn01">';		
	dialogHtml += 	'<a href="#this" id="confirmTrue" class="btn_blue_b">';
	if(confirmBtnNm != undefined){
		dialogHtml += confirmBtnNm;
	}else{
		dialogHtml += (gfv_seLang == 'KR' ? '탑티어(Top-Tier)' : (gfv_seLang == 'EN' ? "탑티어(Top-Tier)" : (gfv_seLang == 'CH' ? '탑티어(Top-Tier)' : '탑티어(Top-Tier)')));
	}
	dialogHtml += 	'</a>';
	dialogHtml += 	'<a href="#this" id="confirmFalse" class="btn_green_b">';
	dialogHtml += (gfv_seLang == 'KR' ? 'D-2' : (gfv_seLang == 'EN' ? "D-2" : (gfv_seLang == 'CH' ? 'D-2' : 'D-2')));
	dialogHtml += 	'</a>';
	dialogHtml += '</div>';

	$("#dialog-message").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		title:'HIKOREA',
		position:['center', 200],
		width:400,		
		zIndex:99,
		open:function(event, ui){
			$('.ui-widget-header').addClass('alert_tit');
			$('.ui-dialog-titlebar-close').hide();
		}
	});		
	$("#dialog-message").html(dialogHtml);
	$("#dialog-message").dialog('open');
	$('#confirmTrue').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostTrue) == false){
			
			// confirm true의 callback 호출
			fv_funcConfirmPostTrue();
			
			// callback 초기화		
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostFalse = null;
		}
	});

	$('#confirmFalse').on("click",function(){
		$("#dialog-message").dialog('close');
		
		// callback 설정시 호출
		if(gfn_isNull(fv_funcConfirmPostFalse) == false){
			
			// confirm false의 callback 호출
			fv_funcConfirmPostFalse();
			
			// callback 초기화
			fv_funcConfirmPostTrue = null;
			fv_funcConfirmPostFalse = null;
		}
	});
}
