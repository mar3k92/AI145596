DROP DATABASE IF EXISTS `SPIS`;
CREATE DATABASE `SPIS`;
USE `SPIS`;

CREATE TABLE `PEOPLE` (
  `PID` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `NAME` VARCHAR(16) NOT NULL,
  `SURNAME` VARCHAR(24) NOT NULL
);

CREATE TABLE `LANDLINE` (
  `LID` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `PERSON` INTEGER NOT NULL REFERENCES `PEOPLE` (`PID`),
  `NUMBER` VARCHAR(16) NOT NULL UNIQUE
);

CREATE TABLE `MOBILE` (
  `MID` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `PERSON` INTEGER NOT NULL REFERENCES `PEOPLE` (`PID`),
  `NUMBER` VARCHAR(16) NOT NULL UNIQUE
);

INSERT INTO `PEOPLE` (`PID`, `NAME`, `SURNAME`) VALUES
(1, 'Dom', 'Dom'),
(2, 'Ciocia', 'Bogusia'),
(3, 'Piotr', 'Kazanowski'),
(4, 'Barbara', 'Szara'),
(5, 'Stanisława', 'Nowak'),
(6, 'Urszula', 'Apollo'),
(7, 'Sabina', 'Kazanowska'),
(8, 'Sławek', 'Kazanowski'),
(9, 'Halina', 'Kazanowska'),
(10, 'Barbara', 'Ponulak'),
(11, 'Maria', 'Przybylska'),
(12, 'Izabela', 'Kozłowska'),
(13, 'Jolanta', 'Kazanowska'),
(14, 'Bogusia', 'kom.'),
(15, 'Wiktoria', 'Dusza'),
(16, 'Zofia', 'Druciak'),
(17, 'Zofia', 'Nowak'),
(18, 'Danuta', 'Hales'),
(19, 'Uszkodzenia', 'telefonu');

INSERT INTO `LANDLINE` (`LID`, `PERSON`, `NUMBER`) VALUES
(1, 1, '183522867'),
(2, 2, '182649189'),
(3, 3, '183535887'),
(4, 4, '134471298'),
(5, 5, '134471266'),
(6, 6, '183520718'),
(7, 7, '183522819');

INSERT INTO `MOBILE` (`MID`, `PERSON`, `NUMBER`) VALUES
(1, 8, '603988040'),
(2, 9, '697597528'),
(3, 10, '661385073'),
(4, 11, '784084064'),
(5, 12, '517772995'),
(6, 13, '797895117'),
(7, 14, '791245111'),
(8, 15, '505697786'),
(9, 16, '513842855'),
(10, 3, '606339713'),
(11, 17, '508985703'),
(12, 18, '506206913'),
(13, 19, '801505505');

SELECT * FROM `PEOPLE`;
SELECT * FROM `LANDLINE`;
SELECT * FROM `MOBILE`;
