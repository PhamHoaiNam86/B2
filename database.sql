-- -------------------------------------------------------------
-- TRIEUVY DEUTSCH - TELC B2 PREPARATION PORTAL DATABASE DUMP
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB / Navicat
-- Database: trieuvy_deutsch
-- Generated for full Laravel Backend Integration
-- -------------------------------------------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------
-- 1. Table structure for `users`
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL COMMENT 'Tên đăng nhập',
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 = Admin (Toàn quyền), 0 = Học viên (Chỉ học)',
  `avatar` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `name`, `username`, `email`, `email_verified_at`, `password`, `is_admin`, `avatar`, `created_at`, `updated_at`) VALUES
(1, 'Admin TrieuVy', 'admin', 'admin@trieuvydeutsch.vn', '2026-09-06 00:00:00', '$2y$12$VVpXqR297AX78wI.20ZuS.NgaBciDtfBr3KonJ/hcZJ9iaGD/CJeO', 1, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'Học Viên B2', 'hocvien', 'hocvien@trieuvydeutsch.vn', '2026-09-06 00:00:00', '$2y$12$VVpXqR297AX78wI.20ZuS.NgaBciDtfBr3KonJ/hcZJ9iaGD/CJeO', 0, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'Nguyễn Minh Huyền', 'minhhuyen', 'huyen.nguyen@gmail.com', '2026-09-06 00:00:00', '$2y$12$VVpXqR297AX78wI.20ZuS.NgaBciDtfBr3KonJ/hcZJ9iaGD/CJeO', 0, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(4, 'Trần Hoàng Nam', 'hoangnam', 'nam.tran@yahoo.com', '2026-09-06 00:00:00', '$2y$12$VVpXqR297AX78wI.20ZuS.NgaBciDtfBr3KonJ/hcZJ9iaGD/CJeO', 0, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(5, 'Phạm Khánh Linh', 'khanhlinh', 'linh.pham@hotmail.com', '2026-09-06 00:00:00', '$2y$12$VVpXqR297AX78wI.20ZuS.NgaBciDtfBr3KonJ/hcZJ9iaGD/CJeO', 0, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', '2026-09-06 00:00:00', '2026-09-06 00:00:00');

-- -------------------------------------------------------------
-- 2. Table structure for `vocabularies`
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `vocabularies`;
CREATE TABLE `vocabularies` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `vocab_id` varchar(50) NOT NULL UNIQUE,
  `word` varchar(255) NOT NULL,
  `article` varchar(20) DEFAULT NULL,
  `plural` varchar(255) DEFAULT NULL,
  `pos` varchar(100) NOT NULL COMMENT 'Nomen, Verb, Adjektiv, Redewendung',
  `phonetic` varchar(255) DEFAULT NULL,
  `meaning_vi` text NOT NULL,
  `example_de` text DEFAULT NULL,
  `example_vi` text DEFAULT NULL,
  `topic` varchar(100) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'learning' COMMENT 'learning, mastered, reviewing',
  `is_favorite` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `vocabularies`
INSERT INTO `vocabularies` (`id`, `vocab_id`, `word`, `article`, `plural`, `pos`, `phonetic`, `meaning_vi`, `example_de`, `example_vi`, `topic`, `status`, `is_favorite`, `created_at`, `updated_at`) VALUES
(1, 'v-1', 'die Ausbildungsvergütung', 'die', 'die Ausbildungsvergütungen', 'Nomen', '/ˈaʊs.bɪl.dʊŋs.fɛɐ̯.ɡyː.tʊŋ/', 'Lương học nghề / Trợ cấp đào tạo nghề', 'In Deutschland erhalten Auszubildende monatlich eine Ausbildungsvergütung.', 'Tại Đức, học sinh học nghề nhận được lương trợ cấp học nghề hàng tháng.', 'Arbeit & Beruf', 'learning', 1, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'v-2', 'die Voraussetzung', 'die', 'die Voraussetzungen', 'Nomen', '/fɔɐ̯ˈaʊs.zɛt.sʊŋ/', 'Điều kiện tiên quyết / Yêu cầu bắt buộc', 'Ein B2-Zertifikat ist eine wichtige Voraussetzung für die Anerkennung.', 'Bằng B2 là một điều kiện quan trọng để công nhận bằng cấp.', 'Bildung & Ausbildung', 'mastered', 0, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'v-3', 'Anerkennung beantragen', '', '', 'Redewendung', '', 'Nộp đơn xin công nhận văn bằng', 'Pflegekräfte müssen bei der zuständigen Behörde die Anerkennung beantragen.', 'Điều dưỡng viên phải nộp đơn xin công nhận bằng tại cơ quan có thẩm quyền.', 'Behörde & Recht', 'reviewing', 1, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(4, 'v-4', 'die Überstunden (Pl.)', 'die', 'die Überstunden', 'Nomen', '/ˈyːbɐ.ʃtʊndən/', 'Giờ làm thêm / Làm ngoài giờ', 'Wenn man Überstunden macht, sollte man Freizeitausgleich bekommen.', 'Khi làm thêm giờ, bạn nên được bù thời gian nghỉ.', 'Arbeit & Beruf', 'learning', 0, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(5, 'v-5', 'die Pflegefachkraft', 'die', 'die Pflegefachkräfte', 'Nomen', '/ˈp͡fleːɡə.fax.kʁaft/', 'Chuyên viên điều dưỡng chuyên nghiệp', 'Deutsche Krankenhäuser suchen dringend nach qualifizierten Pflegefachkräften.', 'Các bệnh viện Đức đang tìm kiếm gấp các chuyên viên điều dưỡng có trình độ.', 'Gesundheit & Medizin', 'learning', 1, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(6, 'v-6', 'der Arbeitgeber', 'der', 'die Arbeitgeber', 'Nomen', '/ˈaʁbaɪtsˌɡeːbɐ/', 'Nhà tuyển dụng / Chủ lao động', 'Der Arbeitgeber bietet ein attraktives Gehalt und Fortbildungsmöglichkeiten.', 'Nhà tuyển dụng đưa ra mức lương hấp dẫn và cơ hội đào tạo nâng cao.', 'Arbeit & Beruf', 'mastered', 0, '2026-09-06 00:00:00', '2026-09-06 00:00:00');

-- -------------------------------------------------------------
-- 3. Table structure for `grammar_topics`
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `grammar_topics`;
CREATE TABLE `grammar_topics` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `topic_id` varchar(50) NOT NULL UNIQUE,
  `title` varchar(255) NOT NULL,
  `level` varchar(50) NOT NULL DEFAULT 'B2',
  `category` varchar(100) NOT NULL,
  `summary` text NOT NULL,
  `content` longtext DEFAULT NULL,
  `rule_points` json DEFAULT NULL,
  `examples` json DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'in_progress' COMMENT 'completed, in_progress, not_started',
  `progress` int(11) NOT NULL DEFAULT 0,
  `score` double(4,2) NOT NULL DEFAULT 0.00,
  `badge_label` varchar(50) NOT NULL DEFAULT 'CẦN LUYỆN',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `grammar_topics`
INSERT INTO `grammar_topics` (`id`, `topic_id`, `title`, `level`, `category`, `summary`, `content`, `rule_points`, `examples`, `status`, `progress`, `score`, `badge_label`, `created_at`, `updated_at`) VALUES
(1, 'g-1', 'Konjunktiv II (Giả định cách & Thể lịch sự B2)', 'B2', 'Verben & Modi', 'Sử dụng wäre/hätte/würde để viết Beschwerdebrief và diễn tả ước muốn, câu điều kiện không có thật.', 'Konjunktiv II được dùng để diễn tả câu điều kiện không có thật, lời khuyên lịch sự, và cấu trúc giả định trong đề thi TELC B2.', '["Viết thư Beschwerdebrief: \\"Ich wäre Ihnen sehr dankbar, wenn Sie...\\"", "Câu điều kiện: \\"Wenn ich mehr Zeit hätte, würde ich deutsch intensiver lernen.\\"", "Lời khuyên: \\"Du solltest an deiner Aussprache arbeiten.\\""]', '[{"de": "Könnten Sie mir bitte die Unterlagen zusenden?", "vi": "Ngài có thể vui lòng gửi tài liệu cho tôi được không?"}, {"de": "Ich hätte gern nähere Informationen über den Kurs.", "vi": "Tôi muốn biết thêm thông tin chi tiết về khóa học."}]', 'completed', 100, 9.50, 'HOÀN THÀNH', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'g-2', 'Passiv & Passiversatzformen (Bị động & Dạng thay thế B2)', 'B2', 'Passivstrukturen', 'Substantiv-Verb-Verbindungen, sein + zu + Infinitiv, -bar/-lich trong bài Leseverstehen Teil 3.', 'Các dạng bị động thay thế giúp rút gọn văn bản và hay xuất hiện trong đề thi đọc hiểu TELC B2.', '["sein + zu + Infinitiv = kann/muss gemacht werden", "Adjektive auf -bar: machbar = kann gemacht werden", "sich lassen + Infinitiv = kann gemacht werden"]', '[{"de": "Die Aufgabe ist leicht zu lösen.", "vi": "Nhiệm vụ này dễ giải quyết."}, {"de": "Das Problem lässt sich schnell beheben.", "vi": "Vấn đề này có thể khắc phục nhanh chóng."}]', 'in_progress', 65, 7.80, 'ĐANG HỌC', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'g-3', 'Relativsätze mit Genitiv & Präpositionen (Mệnh đề quan hệ nâng cao)', 'B2', 'Satzverbindungen', 'Sử dụng dessen, deren, in denen, mit denen trong bài viết và nói B2.', 'Mệnh đề quan hệ dùng Genitiv và Giới từ giúp câu văn mượt mà và nâng cao điểm Grammar trong kỳ thi TELC B2.', '["Genitiv Nam/Trung: dessen | Nữ/Số nhiều: deren", "Giới từ đi kèm: \\"Die Firma, bei der ich arbeite...\\""]', '[{"de": "Der Arzt, dessen Patient ich bin, ist sehr freundlich.", "vi": "Vị bác sĩ mà tôi là bệnh nhân của ông ấy rất thân thiện."}]', 'not_started', 0, 0.00, 'CẦN LUYỆN', '2026-09-06 00:00:00', '2026-09-06 00:00:00');

-- -------------------------------------------------------------
-- 4. Table structure for `exams`
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `exams`;
CREATE TABLE `exams` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_code` varchar(100) NOT NULL UNIQUE,
  `name` varchar(255) NOT NULL,
  `level` varchar(50) NOT NULL DEFAULT 'TELC B2',
  `duration_minutes` int(11) NOT NULL DEFAULT 90,
  `total_questions` int(11) NOT NULL DEFAULT 45,
  `description` text DEFAULT NULL,
  `target_score` int(11) NOT NULL DEFAULT 225,
  `pass_rate` varchar(20) NOT NULL DEFAULT '85%',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sections_json` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `exams`
INSERT INTO `exams` (`id`, `exam_code`, `name`, `level`, `duration_minutes`, `total_questions`, `description`, `target_score`, `pass_rate`, `is_active`, `sections_json`, `created_at`, `updated_at`) VALUES
(1, 'TELC-B2-MOCK-01', 'Đề Thi Thử TELC B2 Tổng Hợp - Mô Phỏng Chuẩn Quốc Tế', 'TELC B2', 90, 45, 'Bộ đề thi thử đầy đủ 4 kỹ năng: Đọc, Nghe, Viết, Nói với đếm ngược thời gian thực và tự động phát hiện chuyển tab gian lận.', 225, '88%', 1, '[{"name": "Leseverstehen", "duration": "45 phút", "questionCount": 20}, {"name": "Sprachbausteine", "duration": "15 phút", "questionCount": 10}, {"name": "Hörverstehen", "duration": "20 phút", "questionCount": 10}, {"name": "Schriftlicher Ausdruck", "duration": "30 phút", "questionCount": 1}]', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'TELC-B2-READING-ONLY', 'Chuyên Đề Luyện Đọc B2 - Leseverstehen & Sprachbausteine', 'TELC B2', 45, 30, 'Luyện tập chuyên sâu phần đọc hiểu 3 phần và ngữ pháp điền từ Sprachbausteine 1 & 2.', 60, '92%', 1, '[{"name": "Leseverstehen Teil 1, 2, 3", "duration": "30 phút", "questionCount": 20}, {"name": "Sprachbausteine Teil 1, 2", "duration": "15 phút", "questionCount": 10}]', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'TELC-B2-WRITING-AI', 'Luyện Viết B2 (Beschwerdebrief & Bitte um Information) + Chấm Điểm', 'TELC B2', 30, 2, 'Luyện tập kỹ năng Schriftlicher Ausdruck bài viết thư khiếu nại Beschwerdebrief theo tiêu chuẩn TELC.', 35, '85%', 1, '[{"name": "Beschwerdebrief", "duration": "30 phút", "questionCount": 1}]', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(4, 'GOETHE-B1-MOCK-01', 'Đề Thi Thử B1 Tổng Hợp - Mô Phỏng Chuẩn Goethe / TELC B1', 'Goethe / TELC B1', 65, 35, 'Đề thi thử trình độ B1 tổng hợp 4 kỹ năng: Đọc hiểu thông báo, Nghe thoại ngắn, Viết thư cá nhân & Bài nói hội thoại.', 180, '90%', 1, '[{"name": "Lesen (Đọc hiểu B1)", "duration": "25 phút", "questionCount": 15}, {"name": "Hören (Nghe hiểu B1)", "duration": "20 phút", "questionCount": 10}, {"name": "Schreiben (Viết thư B1)", "duration": "20 phút", "questionCount": 2}]', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(5, 'GOETHE-A2-MOCK-01', 'Đề Thi Thử A2 Sơ Cấp - Mô Phỏng Chuẩn Goethe / TELC A2', 'Goethe / TELC A2', 50, 25, 'Bộ đề thi thử A2 chuẩn mực dành cho học viên trình độ sơ cấp: từ vựng đời sống, công sở và giao tiếp thường ngày.', 70, '94%', 1, '[{"name": "Lesen (Đọc hiểu A2)", "duration": "20 phút", "questionCount": 10}, {"name": "Hören (Nghe hiểu A2)", "duration": "15 phút", "questionCount": 10}, {"name": "Schreiben (Viết A2)", "duration": "15 phút", "questionCount": 1}]', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(6, 'GOETHE-A1-MOCK-01', 'Đề Thi Thử A1 Cho Người Mới Bắt Đầu - Start Deutsch 1', 'Start Deutsch A1', 45, 20, 'Đề thi thử A1 cơ bản Start Deutsch 1 giúp làm quen với các mẫu biểu, điền form, đọc bảng thông báo và viết tin nhắn ngắn.', 60, '96%', 1, '[{"name": "Lesen (Đọc hiểu A1)", "duration": "20 phút", "questionCount": 10}, {"name": "Hören (Nghe hiểu A1)", "duration": "15 phút", "questionCount": 5}, {"name": "Schreiben (Điền Form & Viết tin nhắn A1)", "duration": "10 phút", "questionCount": 2}]', '2026-09-06 00:00:00', '2026-09-06 00:00:00');

-- -------------------------------------------------------------
-- 5. Table structure for `questions`
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_code` varchar(100) NOT NULL DEFAULT 'TELC-B2-MOCK-01',
  `section` varchar(100) NOT NULL COMMENT 'Leseverstehen, Sprachbausteine, Hörverstehen',
  `sub_section` varchar(255) DEFAULT NULL,
  `question_number` int(11) NOT NULL DEFAULT 1,
  `title` text NOT NULL,
  `context_text` text DEFAULT NULL,
  `options_json` json DEFAULT NULL,
  `correct_option_id` varchar(10) NOT NULL,
  `explanation` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `questions`
INSERT INTO `questions` (`id`, `exam_code`, `section`, `sub_section`, `question_number`, `title`, `context_text`, `options_json`, `correct_option_id`, `explanation`, `created_at`, `updated_at`) VALUES
(1, 'TELC-B2-MOCK-01', 'Leseverstehen', 'Teil 1: Đọc tìm tiêu đề chính', 1, 'Câu 1: Chủ đề của đoạn văn 1 là gì?', 'Văn bản 1: "Immer mehr Pflegekräfte aus dem Ausland entscheiden sich für eine Anstellung in deutschen Krankenhäusern. Durch das neue Fachkräfteeinwanderungsgesetz werden die Anerkennungsverfahren beschleunigt, was den Einstieg in den Arbeitsmarkt erleichtert."', '[{"id": "a", "text": "A. Thủ tục công nhận bằng cấp điều dưỡng nước ngoài được rút ngắn"}, {"id": "b", "text": "B. Tăng lương cho nhân viên y tế tại các bệnh viện lớn"}, {"id": "c", "text": "C. Giảm giờ làm việc cho bác sĩ chuyên khoa"}, {"id": "d", "text": "D. Thi tuyển đầu vào ngành điều dưỡng khắt khe hơn"}]', 'a', 'Từ khóa "Anerkennungsverfahren beschleunigt" thể hiện việc rút ngắn thủ tục công nhận bằng cấp.', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'TELC-B2-MOCK-01', 'Leseverstehen', 'Teil 2: Bài đọc hiểu chi tiết', 2, 'Câu 2: Theo văn bản, điều kiện để nhận trợ cấp học nghề là gì?', 'Văn bản 2: "Die Ausbildungsvergütung wird allen Auszubildenden gewährt, die einen rechtsgültigen Ausbildungsvertrag unterzeichnet haben und regelmäßig am Berufsschulunterricht teilnehmen."', '[{"id": "a", "text": "A. Có hợp đồng học nghề hợp lệ và tham gia đầy đủ buổi học lý thuyết"}, {"id": "b", "text": "B. Đạt bằng C1 tiếng Đức trước khi bắt đầu khóa học"}, {"id": "c", "text": "C. Làm việc tối thiểu 50 giờ mỗi tuần tại bệnh viện"}, {"id": "d", "text": "D. Có kinh nghiệm 2 năm làm việc tại quê nhà"}]', 'a', 'Văn bản nêu rõ "rechtsgültigen Ausbildungsvertrag" và "regelmäßig am Unterricht teilnehmen".', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'TELC-B2-MOCK-01', 'Sprachbausteine', 'Teil 1: Điền từ vào đoạn văn', 3, 'Câu 3: Chọn từ thích hợp điền vào vị trí (3): "Sehr geehrte Damen und Herren, _____ Bezug auf Ihre Anzeige..."', '', '[{"id": "a", "text": "in"}, {"id": "b", "text": "mit"}, {"id": "c", "text": "unter"}, {"id": "d", "text": "auf"}]', 'a', 'Cấu trúc cố định B2: "in Bezug auf etwas (Akk)" nghĩa là "liên quan tới / dựa theo..."', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(4, 'TELC-B2-MOCK-01', 'Hörverstehen', 'Teil 1: Hội thoại ngắn', 4, 'Câu 4: Người phụ nữ trong băng hội thoại muốn yêu cầu điều gì?', '', '[{"id": "a", "text": "A. Thay đổi ca làm việc cuối tuần"}, {"id": "b", "text": "B. Đăng ký tham gia khóa luyện thi TELC B2 cấp tốc"}, {"id": "c", "text": "C. Xin nghỉ phép 2 tuần để gia hạn visa"}, {"id": "d", "text": "D. Mua thêm tài liệu ôn thi tại trung tâm"}]', 'b', NULL, '2026-09-06 00:00:00', '2026-09-06 00:00:00');

-- -------------------------------------------------------------
-- 6. Table structure for `students`
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` varchar(50) NOT NULL UNIQUE,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `class_name` varchar(100) NOT NULL DEFAULT 'B2-K38',
  `current_score` double(6,2) NOT NULL DEFAULT 0.00,
  `target_score` double(6,2) NOT NULL DEFAULT 270.00,
  `target_exam_date` varchar(50) DEFAULT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'Đang Học',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `students`
INSERT INTO `students` (`id`, `student_id`, `name`, `email`, `avatar_url`, `class_name`, `current_score`, `target_score`, `target_exam_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 'stu-1', 'Nguyễn Minh Huyền', 'huyen.nguyen@gmail.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', 'B2-K38', 282.00, 270.00, '15/10/2026', 'Đã Đạt Chuẩn', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'stu-2', 'Trần Hoàng Nam', 'nam.tran@yahoo.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', 'B2-K38', 275.00, 280.00, '20/10/2026', 'Đã Đạt Chuẩn', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'stu-3', 'Phạm Khánh Linh', 'linh.pham@hotmail.com', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', 'B2-K37', 290.00, 285.00, '01/11/2026', 'Đã Đạt Chuẩn', '2026-09-06 00:00:00', '2026-09-06 00:00:00');

-- -------------------------------------------------------------
-- 7. Table structure for `exam_results`
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `exam_results`;
CREATE TABLE `exam_results` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `result_id` varchar(50) NOT NULL UNIQUE,
  `exam_code` varchar(100) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `score` double(6,2) NOT NULL,
  `max_score` double(6,2) NOT NULL DEFAULT 300.00,
  `status_text` varchar(255) NOT NULL,
  `time_ago` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `reading_score` double(6,2) NOT NULL DEFAULT 0.00,
  `listening_score` double(6,2) NOT NULL DEFAULT 0.00,
  `writing_score` double(6,2) NOT NULL DEFAULT 0.00,
  `speaking_score` double(6,2) NOT NULL DEFAULT 0.00,
  `tab_switch_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `exam_results`
INSERT INTO `exam_results` (`id`, `result_id`, `exam_code`, `student_name`, `score`, `max_score`, `status_text`, `time_ago`, `description`, `reading_score`, `listening_score`, `writing_score`, `speaking_score`, `tab_switch_count`, `created_at`, `updated_at`) VALUES
(1, 'f-1', 'TELC-B2-MOCK-01', 'Nguyễn Văn Minh', 242.00, 300.00, 'Đạt chuẩn TELC B2 (Gut)', '10 phút trước', 'Thi thử đợt 1 - Điểm tổng 242/300 (Đọc: 68/75, Nghe: 65/75, Viết: 54/45, Nói: 55/75)', 68.00, 65.00, 54.00, 55.00, 0, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'f-2', 'TELC-B2-MOCK-01', 'Lê Hoàng Nam', 265.00, 300.00, 'Xuất Sắc (Sehr Gut)', '1 giờ trước', 'Thi thử đợt 1 - Điểm tổng 265/300 (Đọc: 72/75, Nghe: 70/75, Viết: 61/45, Nói: 62/75)', 72.00, 70.00, 61.00, 62.00, 0, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'f-3', 'TELC-B2-WRITING-AI', 'Trần Thị Thu Thảo', 38.00, 45.00, 'Đạt phần Viết', '3 giờ trước', 'Bài luyện viết Beschwerdebrief được đánh giá 38/45 điểm', 0.00, 0.00, 38.00, 0.00, 0, '2026-09-06 00:00:00', '2026-09-06 00:00:00');

-- -------------------------------------------------------------
-- 8. Table structure for `document_materials`
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `document_materials`;
CREATE TABLE `document_materials` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `doc_id` varchar(50) NOT NULL UNIQUE,
  `title` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'b2' COMMENT 'b2, schreiben, sprechen',
  `description` text DEFAULT NULL,
  `is_premium` tinyint(1) NOT NULL DEFAULT 1,
  `badge` varchar(50) NOT NULL DEFAULT 'PREMIUM',
  `download_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `document_materials`
INSERT INTO `document_materials` (`id`, `doc_id`, `title`, `type`, `description`, `is_premium`, `badge`, `download_url`, `created_at`, `updated_at`) VALUES
(1, 'doc-b2-1', '8 GIÁO TRÌNH KINH ĐIỂN B2', 'b2', 'Trọn bộ 8 sách học tiếng Đức B2 hay nhất (Aspekte Neu, Sicher, Grammatik Aktiv...)', 1, 'PREMIUM', '/downloads/b2-books.pdf', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'doc-b2-2', 'CỤM CÂU NÊN HỌC B2', 'b2', 'Tổng hợp các cụm từ Redewendungen hay dùng giúp tăng điểm nói/viết', 1, 'PREMIUM', '/downloads/redewendungen.pdf', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'doc-b2-3', 'SÁCH NGỮ PHÁP GRAMMATIK AKTIV B2-C1', 'b2', 'Sách ngữ pháp giải thích chi tiết kèm bài tập thực hành chất lượng cao', 1, 'PREMIUM', '/downloads/grammatik-aktiv.pdf', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(4, 'doc-schreiben-1', 'DÀN Ý BÀI VIẾT THƯ KHIẾU NẠI BESCHWERDEBRIEF B2', 'schreiben', 'Mẫu cấu trúc từng phần Mở bài, Thân bài, Kết bài và các câu Redewendungen ăn điểm', 1, 'PREMIUM', '/downloads/schreiben-muster.pdf', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(5, 'doc-sprechen-1', 'KỊCH BẢN NÓI HỘI THOẠI TELC B2 SPRECHEN TEIL 1, 2, 3', 'sprechen', 'Kịch bản trao đổi thông tin, thảo luận chủ đề và lập kế hoạch chung với bạn thi', 1, 'PREMIUM', '/downloads/sprechen-tipps.pdf', '2026-09-06 00:00:00', '2026-09-06 00:00:00');

SET FOREIGN_KEY_CHECKS = 1;
