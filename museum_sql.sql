-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 24, 2026 at 12:22 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `museum_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `artworks`
--

CREATE TABLE `artworkss` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artworks`
--

INSERT INTO `artworkss` (`id`, `title`, `artist`, `description`, `image_url`) VALUES
('313632', 'Painting', '', 'Date: mid-20th century | Medium: Sago palm petiole, paint, bamboo, fiber', ''),
('316757', 'Painting', '', 'Date: mid-20th century | Medium: Paper, paint', ''),
('316758', 'Painting', '', 'Date: mid-20th century | Medium: Paper, paint', ''),
('316759', 'Painting', '', 'Date: mid-20th century | Medium: Paper, paint', ''),
('316760', 'Painting', '', 'Date: mid-20th century | Medium: Paper, paint', ''),
('316761', 'Painting', '', 'Date: mid-20th century | Medium: Paper, paint', ''),
('351287', 'Painting', 'Gilles Demarteau', 'Date:  | Medium: Chalk manner etching and engraving printed in brown ink', 'https://images.metmuseum.org/CRDImages/dp/web-large/DP825970.jpg'),
('394633', 'Painting', 'Marie Madeleine Igonet', 'Date: 1752 | Medium: Etching and engraving', 'https://images.metmuseum.org/CRDImages/dp/web-large/DP826386.jpg'),
('394741', 'Painting', 'Louis Félix de La Rue', 'Date:  | Medium: Etching', 'https://images.metmuseum.org/CRDImages/dp/web-large/DP826251.jpg'),
('453351', '\"The Angel Gabriel meets \'Amr ibn Zaid (the Shepherd))\", Folio from a Siyer-i Nebi (the Life of the Prophet)', 'Mustafa ibn Vali', 'Date: ca. 1595 | Medium: Ink, opaque watercolor, and gold on paper', 'https://images.metmuseum.org/CRDImages/is/web-large/DP234015.jpg'),
('456949', 'Great Indian Fruit Bat', 'Bhawani Das', 'Date: ca. 1777–82 | Medium: Pencil, ink, and opaque watercolor on paper', 'https://images.metmuseum.org/CRDImages/is/web-large/DP167067.jpg'),
('466105', 'Booklet with Scenes of the Passion', '', 'Date: ca. 1300 (carving); ca. 1310–20 (painting) | Medium: Elephant ivory, polychromy, and gilding', 'https://images.metmuseum.org/CRDImages/md/web-large/DT133.jpg'),
('483042', 'Painting', 'Joan Miró', 'Date: 1927 | Medium: Tempera and oil on canvas', ''),
('488660', 'Painting', 'Charles Henry Alston', 'Date: 1950 | Medium: Oil on canvas', ''),
('490190', 'Painting', 'Philip Guston', 'Date: 1952 | Medium: Oil on canvas', ''),
('51776', 'Painting', 'Bi Chang', 'Date: 18th–19th century | Medium: Album with ten leaves (eight paintings and two title leaves); ink and color on paper', 'https://images.metmuseum.org/CRDImages/as/web-large/DP154526.jpg'),
('51867', 'Painting', 'Unidentified artist', 'Date: 20th century | Medium: Leaf from an album; ink on paper', 'https://images.metmuseum.org/CRDImages/as/web-large/DP154392.jpg'),
('51868', 'Painting', 'Unidentified artist', 'Date: 20th century | Medium: Leaf from an album; ink on paper', 'https://images.metmuseum.org/CRDImages/as/web-large/DP154393.jpg'),
('53750', 'Painting', '', 'Date:  | Medium: Twelve small paintings; on silk?', 'https://images.metmuseum.org/CRDImages/as/web-large/LC-14_76_70h_1-001.jpg'),
('57329', 'Painting', 'Shibata Zeshin', 'Date: 19th century | Medium: Album of seventeen sketches; watercolor on paper; mounted on natural silk', 'https://images.metmuseum.org/CRDImages/as/web-large/DP205561.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `artworkss`
--
ALTER TABLE `artworkss`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
