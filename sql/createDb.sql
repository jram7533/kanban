
DROP DATABASE IF EXISTS `kanban`;

CREATE DATABASE `kanban` DEFAULT CHARACTER SET utf8mb4;

USE `kanban`;

--
-- Table structure for table `kanban`
--

DROP TABLE IF EXISTS `kanban`;

CREATE TABLE `kanban` (
  PRIMARY KEY (`ID`),
  KEY `priority` (`priority`),
  `ID` int NOT NULL AUTO_INCREMENT,
  `title` char(20) NOT NULL DEFAULT '',
  `owner` char(20) NOT NULL DEFAULT '',
  `description` varchar(225) NOT NULL DEFAULT '',
  `assigned` varchar(10) NOT NULL DEFAULT '0000-00-00',
  `due` varchar(10) NOT NULL DEFAULT '0000-00-00',
  `priority` varchar(4) NOT NULL DEFAULT 'LOW',
  `status` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


set autocommit=0;
INSERT INTO `kanban` (`ID`, `title`, `owner`, `description`, `assigned`, `due`, `priority`, `status`) VALUES (1,"1720 PHP Mats","Jack","Work up materials for PHP presentation/lab(s)","2020-01-19","2020-03-19","LOW",1);
INSERT INTO `kanban` (`ID`, `title`, `owner`, `description`, `assigned`, `due`, `priority`, `status`) VALUES (2,"4417 DevOps Lecture","Jack","Update DevOps Lecture","2020-01-19","2020-03-19","MED",2);
INSERT INTO `kanban` (`ID`, `title`, `owner`, `description`, `assigned`, `due`, `priority`, `status`) VALUES (NULL, '1210 Labs', 'Jack', 'Update labs', '2020-01-19', '2020-04-20', 'LOW', '0');
INSERT INTO `kanban` (`ID`, `title`, `owner`, `description`, `assigned`, `due`, `priority`, `status`) VALUES (NULL, '1210 Demos', 'Jack', 'Check demos', '2020-01-19', '2020-04-20', 'LOW', '0');
INSERT INTO `kanban` (`ID`, `title`, `owner`, `description`, `assigned`, `due`, `priority`, `status`) VALUES (NULL, '4417 Labs', 'Jack', 'Check labs', '2020-01-19', '2020-04-20', 'HI', '0');
INSERT INTO `kanban` (`ID`, `title`, `owner`, `description`, `assigned`, `due`, `priority`, `status`) VALUES (NULL, '1720 PHP', 'Jack', 'More PHP mats', '2020-01-19', '2020-04-20', 'LOW', '0');
INSERT INTO `kanban` (`ID`, `title`, `owner`, `description`, `assigned`, `due`, `priority`, `status`) VALUES (NULL, '1720 Grid CSS', 'Jack', 'Work up lecture mats and lab', '2020-01-19', '2010-04-20', 'LOW', '0');
INSERT INTO `kanban` (`ID`, `title`, `owner`, `description`, `assigned`, `due`, `priority`, `status`) VALUES (NULL, '1720 Lecture', 'Jack', 'Work up lecture', '2020-01-19', '2010-04-20', 'LOW', '0');
INSERT INTO `kanban` (`ID`, `title`, `owner`, `description`, `assigned`, `due`, `priority`, `status`) VALUES (NULL, 'Take out Trash', 'Jack', 'Take it out', '2020-01-19', '2010-01-20', 'HI', '0');
INSERT INTO `kanban` (`ID`, `title`, `owner`, `description`, `assigned`, `due`, `priority`, `status`) VALUES (NULL, 'Clean (Home) Office', 'Jack', 'It seriously needs vacuuming', '2020-01-19', '2010-05-20', 'HI', '0');
INSERT INTO `kanban` (`ID`, `title`, `owner`, `description`, `assigned`, `due`, `priority`, `status`) VALUES (NULL, 'Save the Universe', 'Jack', 'It seriously needs saving', '2020-01-19', '2010-05-20', 'MED', '0');
INSERT INTO `kanban` (`ID`, `title`, `owner`, `description`, `assigned`, `due`, `priority`, `status`) VALUES (NULL, 'CSCI 1720 PHP Lecture', 'Jack', 'Finish it', '2020-01-19', '2010-02-20', 'LOW', '0');
INSERT INTO `kanban` (`ID`, `title`, `owner`, `description`, `assigned`, `due`, `priority`, `status`) VALUES (NULL, 'Finish Flowers Book', 'Jack', 'New stuff is coming out', '2020-01-19', '2010-01-31', 'LOW', '0');



commit;

