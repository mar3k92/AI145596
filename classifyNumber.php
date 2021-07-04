<?php
function classifyNumber($num) {
 return preg_match("!^1\d{8}$!", $num) ? 'LANDLINE' : 'MOBILE';
}
?>
