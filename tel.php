<?php
$r = [[], []];
header('Content-Type: application/json');
$c = new mysqli("localhost", "root", "m:l10DeEtAbEeSu5M:3", "SPIS");
 
if (!$c->connect_errno) {
 $q = $c->query("SELECT `LANDLINE`.`LID`, `PEOPLE`.`NAME`, `PEOPLE`.`SURNAME`, `LANDLINE`.`NUMBER` FROM `LANDLINE` JOIN `PEOPLE` ON `PEOPLE`.`PID` = `LANDLINE`.`PERSON` ORDER BY `PEOPLE`.`SURNAME` ASC, `PEOPLE`.`NAME` DESC"); 
 if ($q) {
  if ($q->num_rows) {
   $r[0] = $q->fetch_all(MYSQLI_NUM);
  }
  $q->close();
 }
 $q = $c->query("SELECT `MOBILE`.`MID`, `PEOPLE`.`NAME`, `PEOPLE`.`SURNAME`, `MOBILE`.`NUMBER` FROM `MOBILE` JOIN `PEOPLE` ON `PEOPLE`.`PID` = `MOBILE`.`PERSON` ORDER BY `PEOPLE`.`SURNAME` DESC, `PEOPLE`.`NAME` ASC"); 
 if ($q) {
  if ($q->num_rows) {
   $r[1] = $q->fetch_all(MYSQLI_NUM);
  }
  $q->close();
 }
 $c->close();
}

echo json_encode($r);
?>
