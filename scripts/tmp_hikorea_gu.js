/********************************************
@함수명  	gfn_isNull
@설명   	입력값이 Null이거나 빈값인지 체크한다.
@인자   	String str
@반환    	true (입력값이 Null인 경우),
			false (입력값이 Null이 아닌 경우)
@작성일  	2014. 5. 01.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 01.			        최초작성
*********************************************/
function gfn_isNull(str) {		
    if (new String(str).valueOf() == "undefined") return true;    
    if (str == null) return true;
    if (str == "null") return true;
    var v_ChkStr = new String(str);
    if ("x"+str == "xNaN") return true;    
    if( v_ChkStr.valueOf() == "undefined" ) return true;
    if( v_ChkStr.valueOf() == "null" ) return true;
    if (v_ChkStr == null) return true;    
    if (v_ChkStr.toString().length == 0 ) return true;   
    return false; 
}

/********************************************
@함수명  	gfn_trim
@설명   	문자열 내의 공백을 제거한다.
@인자   	String str
@반환    	공백이 제거된 문자열
@작성일  	2014. 5. 13.
@작성자  	      
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 5. 13.	              최초작성
*********************************************/
function gfn_trim(str){
	if(gfn_isNull(str))
		return str;
	str = str.replace(/\s*/g, "");
	return str;
}

/********************************************
@함수명  	gfn_getBrowserType
@설명   	브라우저의 버전 정보를 확인한다.
@인자   	없음
@반환    	브라우저 버전 정보
@작성일  	2014. 9. 18.
@작성자  	
@변경일			변경자        변경내역 
<br>--------------------------------------------<br>
2014. 9. 18.			        최초작성
*********************************************/
function gfn_getBrowserType(){
	var agent = navigator.userAgent;
     
    //IE 8 ~ 11
    var trident = agent.match(/Trident\/(\d.\d)/i);
    if( trident != null ){
        if( trident[1] == "7.0" ) return rv = "ie" + 11;
        if( trident[1] == "6.0" ) return rv = "ie" + 10;
        if( trident[1] == "5.0" ) return rv = "ie" + 9;
        if( trident[1] == "4.0" ) return rv = "ie" + 8;
    }
    if( navigator.appName == 'Microsoft Internet Explorer' ) return rv = "ie" + 7;
     
    var agt = agent.toLowerCase();
    if (agt.indexOf("chrome") != -1) return 'chrome';
    if (agt.indexOf("opera") != -1) return 'opera'; 
    if (agt.indexOf("firefox") != -1) return 'firefox'; 
    if (agt.indexOf("safari") != -1) return 'safari'; 
    if (agt.indexOf("netscape") != -1) return 'netscape'; 
    if (agt.indexOf("mozilla/5.0") != -1) return 'mozilla';
}
