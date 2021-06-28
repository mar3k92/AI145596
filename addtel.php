<?php
require_once 'classifyNumber.php';
$resp = ['status' => 'FAIL', 'table' => ''];
header('Content-Type: application/json');

function addNumber($PID, $num) {
 $t = '';
 $c = new mysqli("localhost", "root", "m:l10DeEtAbEeSu5M:3", "SPIS");
 if (!$c->connect_errno) {
  $t = classifyNumber($num);
  $q = $c->query("INSERT INTO `".$t."` (`PERSON`, `NUMBER`) VALUES ('".$PID."', '".$num."')"); 
  if (!($q && 0 < $c->affected_rows)) $t = '';
  $c->close();
 }
 return $t;
}

function addPID($n, $s) {
 $r = false;
 $c = new mysqli("localhost", "root", "m:l10DeEtAbEeSu5M:3", "SPIS");
 if (!$c->connect_errno) {
  $q = $c->query("INSERT INTO `PEOPLE` (`NAME`, `SURNAME`) VALUES ('".$n."', '".$s."')"); 
  if ($q) $r = true;
  $c->close();
 }
 return $r;
}

function getPID($n, $s) {
 $r = "-1";
 $c = new mysqli("localhost", "root", "m:l10DeEtAbEeSu5M:3", "SPIS");
 if (!$c->connect_errno) {
  $q = $c->query("SELECT `PID` FROM `PEOPLE` WHERE `NAME` = '".$n."' AND `SURNAME` = '".$s."'"); 
  if ($q && $q->num_rows)
      $r = $q->fetch_array(MYSQLI_NUM)[0];
  $c->close();
 }
 return $r;
}

if (isset($_POST['name']) && isset($_POST['surname']) && isset($_POST['number'])) {
 $PID = getPID($_POST['name'], $_POST['surname']);
 if ($PID == "-1") {
  if (addPID($_POST['name'], $_POST['surname'])) {
   $PID = getPID($_POST['name'], $_POST['surname']);
  }
 }
 if ($PID != "-1") {
  $resp['table'] = addNumber($PID, $_POST['number']);
  if (0 != strlen($resp['table']))
      $resp['status'] = 'OK';
 }
}

echo json_encode($resp);
?>
