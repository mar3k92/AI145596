<?php
function classifyNumber($num) {
 return (preg_match("!^1!", $num) ? 'LANDLINE' : 'MOBILE');
}
?>
