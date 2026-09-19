-- -------------------------------------------------------------
-- TRIEUVY DEUTSCH - TELC & GOETHE PREPARATION PORTAL
-- Complete Database Dump (5 Real Records Per Table)
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB / Navicat
-- -------------------------------------------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------
-- 1. Table structure and data for `users` (5 records)
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL COMMENT 'Tên đăng nhập',
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL COMMENT 'Số điện thoại',
  `address` text DEFAULT NULL COMMENT 'Địa chỉ',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 = Admin, 0 = Học viên',
  `avatar` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `username`, `email`, `phone`, `address`, `email_verified_at`, `password`, `is_admin`, `avatar`, `created_at`, `updated_at`) VALUES
(1, 'Admin TrieuVy', 'admin', 'admin@trieuvydeutsch.vn', '0901234567', 'Số 1 Phạm Văn Đồng, Cầu Giấy, Hà Nội', '2026-09-06 00:00:00', '$2y$12$VVpXqR297AX78wI.20ZuS.NgaBciDtfBr3KonJ/hcZJ9iaGD/CJeO', 1, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'Học Viên B2', 'hocvien', 'hocvien@trieuvydeutsch.vn', '0987654321', '123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội', '2026-09-06 00:00:00', '$2y$12$VVpXqR297AX78wI.20ZuS.NgaBciDtfBr3KonJ/hcZJ9iaGD/CJeO', 0, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'Nguyễn Minh Huyền', 'minhhuyen', 'huyen.nguyen@gmail.com', '0912345678', '45 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', '2026-09-06 00:00:00', '$2y$12$VVpXqR297AX78wI.20ZuS.NgaBciDtfBr3KonJ/hcZJ9iaGD/CJeO', 0, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(4, 'Trần Hoàng Nam', 'hoangnam', 'nam.tran@yahoo.com', '0923456789', '88 Nguyễn Trãi, Thanh Xuân, Hà Nội', '2026-09-06 00:00:00', '$2y$12$VVpXqR297AX78wI.20ZuS.NgaBciDtfBr3KonJ/hcZJ9iaGD/CJeO', 0, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(5, 'Phạm Khánh Linh', 'khanhlinh', 'linh.pham@hotmail.com', '0934567890', '15 Trần Phú, Hà Đông, Hà Nội', '2026-09-06 00:00:00', '$2y$12$VVpXqR297AX78wI.20ZuS.NgaBciDtfBr3KonJ/hcZJ9iaGD/CJeO', 0, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', '2026-09-06 00:00:00', '2026-09-06 00:00:00');

-- -------------------------------------------------------------
-- 2. Table structure and data for `vocabularies` (5 records)
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
  `status` varchar(50) NOT NULL DEFAULT 'learning',
  `is_favorite` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `vocabularies` (`id`, `vocab_id`, `word`, `article`, `plural`, `pos`, `phonetic`, `meaning_vi`, `example_de`, `example_vi`, `topic`, `status`, `is_favorite`, `created_at`, `updated_at`) VALUES
(1, 'voc-1', 'Voraussetzung', 'die', '-en', 'Nomen', '/foːɐ̯ˈʔaʊ̯sˌzɛt͡sʊŋ/', 'Điều kiện tiên quyết, yêu cầu bắt buộc', 'Gute Deutschkenntnisse sind die Voraussetzung für eine Anstellung.', 'Kỹ năng tiếng Đức tốt là điều kiện bắt buộc để được tuyển dụng.', 'Arbeit & Beruf', 'learning', 1, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'voc-2', 'Anerkennung', 'die', '-en', 'Nomen', '/ˈanʔɛʁˌkɛnʊŋ/', 'Sự công nhận (bằng cấp, chứng chỉ)', 'Die Anerkennung des ausländischen Diploms dauert etwa drei Monate.', 'Việc công nhận bằng cấp nước ngoài mất khoảng 3 tháng.', 'Ausbildung', 'mastered', 0, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'voc-3', 'verhandeln', '', '', 'Verb', '/fɛɐ̯ˈhandl̩n/', 'Đàm phán, thương lượng hợp đồng/lương', 'Wir müssen noch über das Gehalt und die Arbeitszeiten verhandeln.', 'Chúng tôi còn phải đàm phán về mức lương và giờ làm việc.', 'Arbeit & Beruf', 'learning', 1, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(4, 'voc-4', 'ausführlich', '', '', 'Adjektiv', '/ˈaʊ̯sfyːɐ̯lɪç/', 'Chi tiết, tỉ mỉ, đầy đủ', 'Der Arzt hat mir den Befund sehr ausführlich erklärt.', 'Bác sĩ đã giải thích cho tôi kết quả xét nghiệm rất tỉ mỉ.', 'Gesundheit', 'mastered', 0, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(5, 'voc-5', 'Sprachbaustein', 'der', '-e', 'Nomen', '/ˈʃpʁaːxbaʊ̯ˌʃtaɪ̯n/', 'Thành tố ngôn ngữ / Ngữ pháp điền từ bẫy', 'Im Teil Sprachbausteine muss man die richtige Präposition wählen.', 'Trong phần Sprachbausteine bạn phải chọn đúng giới từ.', 'Prüfung', 'learning', 1, '2026-09-06 00:00:00', '2026-09-06 00:00:00');

-- -------------------------------------------------------------
-- 3. Table structure and data for `grammar_topics` (5 records)
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
  `status` varchar(50) NOT NULL DEFAULT 'in_progress',
  `progress` int(11) NOT NULL DEFAULT 0,
  `score` double(4,2) NOT NULL DEFAULT 0.00,
  `badge_label` varchar(50) NOT NULL DEFAULT 'CẦN LUYỆN',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `grammar_topics` (`id`, `topic_id`, `title`, `level`, `category`, `summary`, `content`, `rule_points`, `examples`, `status`, `progress`, `score`, `badge_label`, `created_at`, `updated_at`) VALUES
(1, 'gram-1', 'Passiv mit Modalverben (Thể bị động với động từ khuyết thiếu)', 'B2', 'Verben & Modi', 'Cấu trúc bị động đi kèm Modalverben dùng rất phổ biến trong văn bản thông báo và đề thi TELC B2.', 'Thể bị động với động từ khuyết thiếu được tạo thành bởi: Modalverb + Partizip II + werden.', '["Hiện tại: Modalverb (chia) + Partizip II + werden","Quá khứ: Modalverb im Präteritum + Partizip II + werden","Bẫy đề thi: Chú ý vị trí của động từ werden luôn đứng ở cuối câu phụ."]', '[{"de": "Die Unterlagen müssen bis Freitag eingereicht werden.", "vi": "Hồ sơ phải được nộp trước thứ Sáu."}, {"de": "Das Formular musste sofort ausgefüllt werden.", "vi": "Mẫu đơn đã phải được điền ngay lập tức."}]', 'completed', 100, 95.00, 'XUẤT SẮC', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'gram-2', 'Subjunktionen & Konnektoren (Liên từ phụ thuộc B2)', 'B2', 'Satzbau', 'Phân biệt liên từ chỉ nguyên nhân, nhượng bộ, điều kiện: sodass, anstatt dass, ohne dass, obwohl.', 'Liên từ phụ thuộc luôn đẩy động từ chia xuống cuối câu phụ (Verb am Ende).', '["obwohl / obgleich: chỉ sự nhượng bộ (mặc dù)","ohne dass: chỉ hành động không xảy ra như mong đợi","anstatt dass: thay vì làm hành động này thì làm hành động khác"]', '[{"de": "Er hat die Prüfung bestanden, obwohl er wenig gelernt hatte.", "vi": "Anh ấy đã đỗ kỳ thi mặc dù học rất ít."}, {"de": "Sie ging weg, ohne dass jemand es bemerkte.", "vi": "Cô ấy rời đi mà không ai chú ý."}]', 'in_progress', 75, 82.00, 'TIẾN BỘ', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'gram-3', 'Nomen-Verb-Verbindungen (Cụm Danh - Động từ cố định)', 'B2', 'Wortschatz & Stil', 'Các cụm từ cố định giúp nâng cao điểm bài Viết (Schreiben) và Nói (Sprechen) chuẩn văn phong B2.', 'Nomen-Verb-Verbindungen thay thế cho các động từ đơn để tạo văn phong trang trọng hơn.', '["zur Verfügung stehen = vorhanden sein (có sẵn)","in Betracht ziehen = überlegen (cân nhắc)","Rücksicht nehmen auf = berücksichtigen (tôn trọng/chú ý)"]', '[{"de": "Ich stehe Ihnen für Fragen gerne zur Verfügung.", "vi": "Tôi luôn sẵn sàng trả lời các câu hỏi của bạn."}, {"de": "Wir müssen alle Optionen in Betracht ziehen.", "vi": "Chúng ta phải cân nhắc tất cả các phương án."}]', 'in_progress', 60, 78.00, 'CẦN LUYỆN', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(4, 'gram-4', 'Konjunktiv II in der Vergangenheit (Giả định quá khứ)', 'B2', 'Verben & Grammatik', 'Dùng để diễn tả sự hối tiếc hoặc một giả thiết trái ngược với thực tế trong quá khứ.', 'Cấu trúc: hätte / wäre + Partizip II.', '["Động từ di chuyển/biến đổi trạng thái dùng: wäre + Partizip II","Các động từ còn lại dùng: hätte + Partizip II","Bẫy đề thi: Chú ý câu điều kiện Wenn ..., hätte/wäre ..."]', '[{"de": "Hätte ich mehr gelernt, hätte ich die B2-Prüfung bestanden.", "vi": "Nếu tôi học nhiều hơn thì tôi đã đỗ kỳ thi B2 rồi."}, {"de": "Wäre er pünktlich gekommen, hätten wir den Zug erreicht.", "vi": "Nếu anh ấy đến đúng giờ thì chúng ta đã bắt kịp chuyến tàu."}]', 'not_started', 0, 0.00, 'CHƯA HỌC', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(5, 'gram-5', 'Relativsätze mit Präpositionen (Mệnh đề quan hệ với giới từ)', 'B2', 'Satzbau', 'Mệnh đề quan hệ đi kèm giới từ đòi hỏi xác định chính xác cách (Dativ / Akkusativ) của đại từ quan hệ.', 'Giới từ đứng trước đại từ quan hệ và quyết định biến cách của đại từ quan hệ đó.', '["Xác định giới từ đi kèm động từ trong câu phụ","Xác định danh từ được bổ nghĩa là giống Nam, Nữ, Trung hay Số nhiều","Biến cách đại từ quan hệ tương ứng: dem, der, den, denen"]', '[{"de": "Das ist die Kollegin, mit der ich zusammenarbeite.", "vi": "Đó là đồng nghiệp nữ mà tôi làm việc cùng."}, {"de": "Die Firma, bei der er arbeitet, ist sehr bekannt.", "vi": "Công ty mà anh ấy làm việc rất nổi tiếng."}]', 'completed', 100, 90.00, 'XUẤT SẮC', '2026-09-06 00:00:00', '2026-09-06 00:00:00');

-- -------------------------------------------------------------
-- 4. Table structure and data for `exams` (5 records)
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

INSERT INTO `exams` (`id`, `exam_code`, `name`, `level`, `duration_minutes`, `total_questions`, `description`, `target_score`, `pass_rate`, `is_active`, `sections_json`, `created_at`, `updated_at`) VALUES
(1, 'TELC-B2-MOCK-01', 'Đề Thi Thử TELC B2 Tổng Hợp Đợt 1', 'TELC B2', 90, 45, 'Bộ đề thi thử tiêu chuẩn cấu trúc TELC B2 với 4 kỹ năng Đọc, Nghe, Viết và Ngữ pháp bẫy.', 225, '88%', 1, '[{"name": "Leseverstehen", "duration": "45 phút", "questionCount": 20}, {"name": "Sprachbausteine", "duration": "15 phút", "questionCount": 10}, {"name": "Hörverstehen", "duration": "20 phút", "questionCount": 10}, {"name": "Schriftlicher Ausdruck", "duration": "30 phút", "questionCount": 1}]', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'GOETHE-B2-MOCK-01', 'Đề Thi Thử Goethe-Zertifikat B2 Đợt 1', 'GOETHE B2', 100, 40, 'Đề thi thử định dạng Goethe B2 gồm 4 kỹ năng Lesen, Hören, Schreiben, Sprechen riêng biệt.', 240, '90%', 1, '[{"name": "Lesen", "duration": "65 phút", "questionCount": 15}, {"name": "Hören", "duration": "40 phút", "questionCount": 15}, {"name": "Schreiben", "duration": "75 phút", "questionCount": 2}, {"name": "Sprechen", "duration": "15 phút", "questionCount": 2}]', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'TELC-B1-MOCK-01', 'Đề Thi Thử TELC B1 Tiêu Chuẩn', 'TELC B1', 90, 40, 'Bộ đề thi thử trình độ B1 đánh giá kỹ năng từ vựng và giao tiếp hàng ngày.', 210, '92%', 1, '[{"name": "Leseverstehen", "duration": "45 phút", "questionCount": 20}, {"name": "Hörverstehen", "duration": "20 phút", "questionCount": 10}, {"name": "Schreiben", "duration": "30 phút", "questionCount": 1}]', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(4, 'GOETHE-A2-MOCK-01', 'Đề Thi Thử Goethe-Zertifikat A2', 'GOETHE A2', 60, 30, 'Đề thi căn bản A2 phù hợp học viên hoàn thành khóa A2 sơ cấp.', 180, '95%', 1, '[{"name": "Lesen", "duration": "30 phút", "questionCount": 15}, {"name": "Hören", "duration": "20 phút", "questionCount": 15}]', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(5, 'GOETHE-C1-MOCK-01', 'Đề Thi Thử Goethe-Zertifikat C1 Chuyên Sâu', 'GOETHE C1', 120, 50, 'Bộ đề thi cao cấp C1 luyện tập từ vựng học thuật và kỹ năng tổng hợp.', 250, '82%', 1, '[{"name": "Lesen", "duration": "70 phút", "questionCount": 25}, {"name": "Hören", "duration": "40 phút", "questionCount": 25}]', '2026-09-06 00:00:00', '2026-09-06 00:00:00');

-- -------------------------------------------------------------
-- 5. Table structure and data for `questions` (5 records)
-- -------------------------------------------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_code` varchar(100) NOT NULL,
  `section` varchar(100) NOT NULL,
  `sub_section` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT 'choice',
  `question_number` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `context_text` text DEFAULT NULL,
  `audio_url` text DEFAULT NULL,
  `options_json` json DEFAULT NULL,
  `correct_option_id` varchar(20) DEFAULT NULL,
  `explanation` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `questions` (`id`, `exam_code`, `section`, `sub_section`, `type`, `question_number`, `title`, `context_text`, `audio_url`, `options_json`, `correct_option_id`, `explanation`, `created_at`, `updated_at`) VALUES
(1, 'TELC-B2-MOCK-01', 'Leseverstehen', 'Teil 1: Đọc tìm tiêu đề chính', 'choice', 1, 'Câu 1: Chủ đề chính của đoạn văn là gì?', 'Văn bản 1: "Immer mehr Pflegekräfte aus dem Ausland entscheiden sich für eine Anstellung in deutschen Krankenhäusern. Durch das neue Fachkräfteeinwanderungsgesetz werden die Anerkennungsverfahren beschleunigt."', NULL, '[{"id": "a", "text": "A. Thủ tục công nhận bằng cấp điều dưỡng nước ngoài được rút ngắn"}, {"id": "b", "text": "B. Tăng lương cho nhân viên y tế tại các bệnh viện lớn"}, {"id": "c", "text": "C. Giảm giờ làm việc cho bác sĩ chuyên khoa"}, {"id": "d", "text": "D. Thi tuyển đầu vào ngành điều dưỡng khắt khe hơn"}]', 'a', 'Từ khóa "Anerkennungsverfahren beschleunigt" thể hiện việc rút ngắn thủ tục công nhận bằng cấp.', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'TELC-B2-MOCK-01', 'Leseverstehen', 'Teil 2: Bài đọc hiểu chi tiết', 'choice', 2, 'Câu 2: Điều kiện nhận trợ cấp học nghề là gì?', 'Văn bản 2: "Die Ausbildungsvergütung wird allen Auszubildenden gewährt, die einen rechtsgültigen Ausbildungsvertrag unterzeichnet haben und regelmäßig am Berufsschulunterricht teilnehmen."', NULL, '[{"id": "a", "text": "A. Có hợp đồng học nghề hợp lệ và tham gia đầy đủ buổi học lý thuyết"}, {"id": "b", "text": "B. Đạt bằng C1 tiếng Đức trước khi bắt đầu khóa học"}, {"id": "c", "text": "C. Làm việc tối thiểu 50 giờ mỗi tuần tại bệnh viện"}, {"id": "d", "text": "D. Có kinh nghiệm 2 năm làm việc tại quê nhà"}]', 'a', 'Văn bản nêu rõ "rechtsgültigen Ausbildungsvertrag" và "regelmäßig am Unterricht teilnehmen".', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'TELC-B2-MOCK-01', 'Sprachbausteine', 'Teil 1: Điền từ vào đoạn văn', 'choice', 3, 'Câu 3: Chọn giới từ phù hợp: "Sehr geehrte Damen und Herren, _____ Bezug auf Ihre Anzeige..."', '', NULL, '[{"id": "a", "text": "in"}, {"id": "b", "text": "mit"}, {"id": "c", "text": "unter"}, {"id": "d", "text": "auf"}]', 'a', 'Cấu trúc cố định B2: "in Bezug auf etwas (Akk)" nghĩa là liên quan tới...', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(4, 'TELC-B2-MOCK-01', 'Hörverstehen', 'Teil 1: Hội thoại ngắn', 'choice', 4, 'Câu 4: Người phụ nữ trong hội thoại muốn yêu cầu điều gì?', '', NULL, '[{"id": "a", "text": "A. Thay đổi ca làm việc cuối tuần"}, {"id": "b", "text": "B. Đăng ký tham gia khóa luyện thi TELC B2 cấp tốc"}, {"id": "c", "text": "C. Xin nghỉ phép 2 tuần để gia hạn visa"}, {"id": "d", "text": "D. Mua thêm tài liệu ôn thi tại trung tâm"}]', 'b', 'Người nói yêu cầu tham gia khóa luyện thi B2 cấp tốc.', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(5, 'GOETHE-B2-MOCK-01', 'Lesen', 'Teil 1: Đọc bài báo khoa học', 'choice', 5, 'Câu 5: Tác giả muốn truyền tải thông điệp gì về chuyển đổi số?', 'Văn bản: "Die Digitalisierung verändert nicht nur die Wirtschaft, sondern auch die Qualifikationsanforderungen an Arbeitnehmer im Gesundheitswesen."', NULL, '[{"id": "a", "text": "A. Chuyển đổi số làm thay đổi yêu cầu trình độ người lao động"}, {"id": "b", "text": "B. Máy tính sẽ thay thế toàn bộ nhân viên y tế"}, {"id": "c", "text": "C. Ngành y tế không bị ảnh hưởng bởi công nghệ"}, {"id": "d", "text": "D. Nhân viên y tế nên nghỉ việc nếu không biết lập trình"}]', 'a', 'Văn bản nhấn mạnh "verändert die Qualifikationsanforderungen an Arbeitnehmer".', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(6, 'MOCK-9988', 'Lesen Teil 1', 'Đọc hiểu cơ bản', 'choice', 1, 'Câu 1: Lớp học tiếng Đức A1 bắt đầu khi nào?', 'Guten Tag! Der Deutschkurs A1 beginnt am Montag um 09:00 Uhr im Raum 102.', NULL, '[{"id": "a", "text": "A. Thứ Hai lúc 09:00 sáng tại phòng 102", "isCorrect": true}, {"id": "b", "text": "B. Thứ Ba lúc 10:00 sáng tại phòng 201", "isCorrect": false}]', 'a', 'Văn bản ghi rõ am Montag um 09:00 Uhr im Raum 102.', '2026-09-19 21:40:00', '2026-09-19 21:40:00'),
(7, 'MOCK-9988', 'Lesen Teil 1', 'Đọc hiểu cơ bản', 'choice', 2, 'Câu 2: Bạn có thể mua vé xe buýt ở đâu?', 'Fahrkarten erhalten Sie am Fahrkartenautomaten oder direkt beim Busfahrer.', NULL, '[{"id": "a", "text": "A. Tại máy bán vé tự động hoặc bác tài xế", "isCorrect": true}, {"id": "b", "text": "B. Chỉ mua online qua website", "isCorrect": false}]', 'a', 'Văn bản ghi am Fahrkartenautomaten oder direkt beim Busfahrer.', '2026-09-19 21:40:00', '2026-09-19 21:40:00'),
(8, 'MOCK-9988', 'Hören Teil 1', 'Nghe thoại ngắn A1', 'choice', 3, 'Câu 3: Số điện thoại của cô Müller là số nào?', 'Hallo, hier ist Frau Müller. Meine Telefonnummer ist 0176-543210.', NULL, '[{"id": "a", "text": "A. 0176-543210", "isCorrect": true}, {"id": "b", "text": "B. 0176-543211", "isCorrect": false}]', 'a', 'Số điện thoại là 0176-543210.', '2026-09-19 21:40:00', '2026-09-19 21:40:00'),
(9, 'MOCK-9988', 'Schreiben Teil 1', 'Bài viết thư A1', 'writing', 4, 'Câu 4: Viết một email ngắn rủ bạn đi xem phim vào cuối tuần', 'Schreiben Sie eine E-Mail an Ihre Freundin Eva: Sie möchten am Samstag zusammen ins Kino gehen. Vorschlag für Treffpunkt und Uhrzeit (ca. 30 Wörter).', NULL, '[]', '', 'Bài mẫu: Liebe Eva, wie geht es dir? Möchtest du am Samstag zusammen ins Kino gehen?...', '2026-09-19 21:40:00', '2026-09-19 21:40:00'),
(10, 'MOCK-9988', 'Sprachbausteine', 'Từ vựng & Ngữ pháp A1', 'choice', 5, 'Câu 5: Chọn đại từ nhân xưng phù hợp: Wie heißen ___?', 'Guten Tag, Herr Weber! Wie heißen ___?', NULL, '[{"id": "a", "text": "A. Sie", "isCorrect": true}, {"id": "b", "text": "B. du", "isCorrect": false}]', 'a', 'Trang trọng với Herr Weber dùng đại từ Sie.', '2026-09-19 21:40:00', '2026-09-19 21:40:00');

-- -------------------------------------------------------------
-- 6. Table structure and data for `students` (5 records)
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

INSERT INTO `students` (`id`, `student_id`, `name`, `email`, `avatar_url`, `class_name`, `current_score`, `target_score`, `target_exam_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 'stu-1', 'Nguyễn Minh Huyền', 'huyen.nguyen@gmail.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', 'B2-K38', 282.00, 270.00, '15/10/2026', 'Đã Đạt Chuẩn', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'stu-2', 'Trần Hoàng Nam', 'nam.tran@yahoo.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', 'B2-K38', 275.00, 280.00, '20/10/2026', 'Đã Đạt Chuẩn', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'stu-3', 'Phạm Khánh Linh', 'linh.pham@hotmail.com', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', 'B2-K37', 290.00, 285.00, '01/11/2026', 'Đã Đạt Chuẩn', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(4, 'stu-4', 'Vũ Thị Thanh Hằng', 'hang.vu@gmail.com', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', 'B2-K39', 268.00, 270.00, '10/11/2026', 'Đang Tăng Tốc', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(5, 'stu-5', 'Đặng Quốc Bảo', 'bao.dang@gmail.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', 'B2-K38', 260.00, 270.00, '25/11/2026', 'Đang Tăng Tốc', '2026-09-06 00:00:00', '2026-09-06 00:00:00');

-- -------------------------------------------------------------
-- 7. Table structure and data for `exam_results` (5 records)
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

INSERT INTO `exam_results` (`id`, `result_id`, `exam_code`, `student_name`, `score`, `max_score`, `status_text`, `time_ago`, `description`, `reading_score`, `listening_score`, `writing_score`, `speaking_score`, `tab_switch_count`, `created_at`, `updated_at`) VALUES
(1, 'RES-10001', 'TELC-B2-MOCK-01', 'Phạm Khánh Linh', 290.00, 300.00, 'Xuất Sắc (Sehr Gut)', '10 phút trước', 'Hoàn thành bài thi thử TELC B2 Đợt 1 đạt 290/300 điểm', 74.00, 72.00, 72.00, 72.00, 0, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'RES-10002', 'TELC-B2-MOCK-01', 'Nguyễn Minh Huyền', 282.00, 300.00, 'Đạt Chuẩn TELC B2 (Gut)', '45 phút trước', 'Hoàn thành bài thi thử TELC B2 Đợt 1 đạt 282/300 điểm', 72.00, 70.00, 70.00, 70.00, 0, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'RES-10003', 'GOETHE-B2-MOCK-01', 'Trần Hoàng Nam', 275.00, 300.00, 'Đạt Chuẩn Goethe B2', '2 giờ trước', 'Hoàn thành bài thi thử Goethe B2 Đợt 1 đạt 275/300 điểm', 70.00, 68.00, 67.00, 70.00, 1, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(4, 'RES-10004', 'TELC-B1-MOCK-01', 'Vũ Thị Thanh Hằng', 268.00, 300.00, 'Đạt Chuẩn TELC B1', '4 giờ trước', 'Hoàn thành bài thi thử TELC B1 đạt 268/300 điểm', 68.00, 66.00, 67.00, 67.00, 0, '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(5, 'RES-10005', 'GOETHE-A2-MOCK-01', 'Đặng Quốc Bảo', 260.00, 300.00, 'Đạt Chuẩn Goethe A2', '1 ngày trước', 'Hoàn thành bài thi thử Goethe A2 đạt 260/300 điểm', 65.00, 65.00, 65.00, 65.00, 0, '2026-09-06 00:00:00', '2026-09-06 00:00:00');

-- -------------------------------------------------------------
-- 8. Table structure and data for `document_materials` (5 records)
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

INSERT INTO `document_materials` (`id`, `doc_id`, `title`, `type`, `description`, `is_premium`, `badge`, `download_url`, `created_at`, `updated_at`) VALUES
(1, 'doc-b2-1', '8 GIÁO TRÌNH KINH ĐIỂN B2 TIẾNG ĐỨC', 'b2', 'Trọn bộ 8 sách học tiếng Đức B2 hay nhất (Aspekte Neu, Sicher, Grammatik Aktiv...)', 1, 'PREMIUM', '/downloads/b2-books.pdf', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(2, 'doc-b2-2', 'TỔNG HỢP CỤM CÂU REDEWENDUNGEN B2', 'b2', 'Tổng hợp các cụm từ Redewendungen hay dùng giúp tăng điểm nói/viết B2', 1, 'PREMIUM', '/downloads/redewendungen.pdf', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(3, 'doc-schreiben-1', 'BỘ 20 BÀI MẪU BESCHWERDEBRIEF B2 45/45', 'schreiben', 'Tổng hợp 20 bài viết khiếu nại đạt điểm tối đa kèm phân tích cấu trúc từ nối', 1, 'PREMIUM', '/downloads/schreiben-muster.pdf', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(4, 'doc-schreiben-2', 'CẤU TRÚC VÀ TỪ NỐI VIẾT THƯ BITTE UM INFORMATION', 'schreiben', 'Dàn ý và mẫu câu xin thông tin/đăng ký dịch vụ tiêu chuẩn TELC B2', 0, 'MIỄN PHÍ', '/downloads/schreiben-info.pdf', '2026-09-06 00:00:00', '2026-09-06 00:00:00'),
(5, 'doc-sprechen-1', 'KỊCH BẢN NÓI HỘI THOẠI TELC B2 SPRECHEN', 'sprechen', 'Kịch bản mẫu Teil 1 (Kể trải nghiệm), Teil 2 (Thảo luận) & Teil 3 (Lập kế hoạch)', 1, 'PREMIUM', '/downloads/sprechen-tipps.pdf', '2026-09-06 00:00:00', '2026-09-06 00:00:00');

SET FOREIGN_KEY_CHECKS = 1;
