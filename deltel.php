<?php
require_once 'classifyNumber.php';
$resp = ['status' => 'FAIL'];
header('Content-Type: application/json');

function delNumber($num) {
 $r = false;
 $c = new mysqli("localhost", "root", "m:l10DeEtAbEeSu5M:3", "SPIS");
 if (!$c->connect_errno) {
  $t = classifyNumber($num);
  $q = $c->query("DELETE FROM `".$t."` WHERE `NUMBER` = '".$num."'"); 
  if ($q && 0 < $c->affected_rows) $r = true;
  $c->close();
 }
 return $r;
}

function delPID($p) {
 $r = false;
 $c = new mysqli("localhost", "root", "m:l10DeEtAbEeSu5M:3", "SPIS");
 if (!$c->connect_errno) {
  $q = $c->query("DELETE FROM `PEOPLE` WHERE `PID` = '".$p."'"); 
  if ($q) $r = true;
  $c->close();
 }
 return $r;
}

function usedPID($PID, $t) {
 $r = false;
 $c = new mysqli("localhost", "root", "m:l10DeEtAbEeSu5M:3", "SPIS");
 if (!$c->connect_errno) {
  $id = substr($t, 0, 1).'ID';
  $q = $c->query("SELECT `NUMBER` FROM `".$t."` WHERE `".$id."` = '".$num."'"); 
  if ($q && $q->num_rows)
      $r = true;
  $c->close();
 }
 return $r;
}

function getPID($num) {
 $r = "-1";
 $c = new mysqli("localhost", "root", "m:l10DeEtAbEeSu5M:3", "SPIS");
 if (!$c->connect_errno) {
  $t = (preg_match("!^1!", $num) ? 'LANDLINE' : 'MOBILE');
  $q = $c->query("SELECT `PERSON` FROM `".$t."` WHERE `NUMBER` = '".$num."'"); 
  if ($q && $q->num_rows)
      $r = $q->fetch_array(MYSQLI_NUM)[0];
  $c->close();
 }
 return $r;
}

if (isset($_POST['number'])) {
 $PID = getPID($_POST['number']);
 if (delNumber($_POST['number'])) {
  $resp['status'] = "OK";
  if (!usedPID($PID, 'LANDLINE') && !usedPID($PID, 'MOBILE'))
      delPID($PID);
 }
}

echo json_encode($resp);
?>
