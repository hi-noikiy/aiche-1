<?php
 
$language_id = "zh_CN";  
global $arrlist,$lang_file_trans;
 
$arrlist = array();
$dir = dirname(__FILE__).'/';
$file = $dir.$language_id."/app.php";

 
$lang_file_trans = $file;
if(file_exists($file)){
	$arrlist = include $file;
	$arrlist['lang'] = $language_id;
}

 
function youdaotran($str){
	//繁体请自行处理
	return $str;

/*
	$url = 'http://fanyi.youdao.com/openapi.do?keyfrom=shopyuanfeng&key=1377180809&type=data&doctype=json&version=1.1&q='.urlencode($str);
	 
	$opts = array(  
	    'http'=>array(  
	        'method'=>"GET",  
	        'timeout'=>5,  
	    )  
	 );  
	$context = stream_context_create($opts);      
	return @json_decode(file_get_contents($url, false, $context))->translation[0]; 
*/

}
 

function __($str)
{
	global $arrlist,$lang_file_trans;
 
	if(!$arrlist[$str]){
	 	 $arrlist[$str] =  youdaotran($str)?:$str; 
		 file_put_contents( $lang_file_trans , "<?php return ".var_export($arrlist, true).";");
	}
	 
	return $arrlist[$str]?$arrlist[$str]:$str;
}
