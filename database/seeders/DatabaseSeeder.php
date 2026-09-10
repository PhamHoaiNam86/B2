<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\GrammarTopic;
use App\Models\Question;
use App\Models\Student;
use App\Models\Vocabulary;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Exams (Start empty as requested by admin)
        Exam::truncate();
        Question::truncate();

        // 2. Seed Vocabularies
        Vocabulary::truncate();
        $vocabs = [
            [
                'vocab_id' => 'v-1',
                'word' => 'die Ausbildungsvergütung',
                'article' => 'die',
                'plural' => 'die Ausbildungsvergütungen',
                'pos' => 'Nomen',
                'phonetic' => '/ˈaʊs.bɪl.dʊŋs.fɛɐ̯.ɡyː.tʊŋ/',
                'meaning_vi' => 'Lương học nghề / Tiền trợ cấp đào tạo nghề',
                'example_de' => 'In Deutschland erhalten Auszubildende monatlich eine Ausbildungsvergütung.',
                'example_vi' => 'Tại Đức, học sinh học nghề nhận được lương trợ cấp học nghề hàng tháng.',
                'topic' => 'Arbeit & Beruf',
                'status' => 'learning',
                'is_favorite' => true,
            ],
            [
                'vocab_id' => 'v-2',
                'word' => 'die Voraussetzung',
                'article' => 'die',
                'plural' => 'die Voraussetzungen',
                'pos' => 'Nomen',
                'phonetic' => '/fɔɐ̯ˈaʊs.zɛt.sʊŋ/',
                'meaning_vi' => 'Điều kiện tiên quyết / Yêu cầu bắt buộc',
                'example_de' => 'Ein B2-Zertifikat ist eine wichtige Voraussetzung für die Anerkennung.',
                'example_vi' => 'Bằng B2 là một điều kiện quan trọng để công nhận bằng cấp.',
                'topic' => 'Bildung & Ausbildung',
                'status' => 'mastered',
                'is_favorite' => false,
            ],
            [
                'vocab_id' => 'v-3',
                'word' => 'Anerkennung beantragen',
                'article' => null,
                'plural' => null,
                'pos' => 'Redewendung',
                'phonetic' => null,
                'meaning_vi' => 'Nộp đơn xin công nhận văn bằng',
                'example_de' => 'Pflegekräfte müssen bei der zuständigen Behörde die Anerkennung beantragen.',
                'example_vi' => 'Điều dưỡng viên phải nộp đơn xin công nhận bằng tại cơ quan có thẩm quyền.',
                'topic' => 'Behörde & Recht',
                'status' => 'reviewing',
                'is_favorite' => true,
            ],
            [
                'vocab_id' => 'v-4',
                'word' => 'die Überstunden (Pl.)',
                'article' => 'die',
                'plural' => 'die Überstunden',
                'pos' => 'Nomen',
                'phonetic' => '/ˈyːbɐ.ʃtʊndən/',
                'meaning_vi' => 'Giờ làm thêm / Làm ngoài giờ',
                'example_de' => 'Wenn man Überstunden macht, sollte man Freizeitausgleich bekommen.',
                'example_vi' => 'Khi làm thêm giờ, bạn nên được bù thời gian nghỉ.',
                'topic' => 'Arbeit & Beruf',
                'status' => 'learning',
                'is_favorite' => false,
            ],
        ];

        foreach ($vocabs as $vocab) {
            Vocabulary::create($vocab);
        }

        // 3. Seed Grammar Topics
        GrammarTopic::truncate();
        GrammarTopic::create([
            'topic_id' => 'g-1',
            'title' => 'Konjunktiv II (Giả định cách & Thể lịch sự B2)',
            'level' => 'B2',
            'category' => 'Verben & Modi',
            'summary' => 'Sử dụng wäre/hätte/würde để viết Beschwerdebrief và diễn tả ước muốn, câu điều kiện không có thật.',
            'content' => 'Konjunktiv II được dùng để diễn tả câu điều kiện không có thật, lời khuyên lịch sự, và cấu trúc giả định trong đề thi TELC B2.',
            'rule_points' => [
                'Viết thư Beschwerdebrief: "Ich wäre Ihnen sehr dankbar, wenn Sie..."',
                'Câu điều kiện: "Wenn ich mehr Zeit hätte, würde ich deutsch intensiver lernen."',
            ],
            'examples' => [
                ['de' => 'Könnten Sie mir bitte die Unterlagen zusenden?', 'vi' => 'Ngài có thể vui lòng gửi tài liệu cho tôi được không?'],
            ],
            'status' => 'completed',
            'progress' => 100,
            'score' => 9.5,
            'badge_label' => 'HOÀN THÀNH',
        ]);

        GrammarTopic::create([
            'topic_id' => 'g-2',
            'title' => 'Passiv & Passiversatzformen (Bị động & Dạng thay thế B2)',
            'level' => 'B2',
            'category' => 'Passivstrukturen',
            'summary' => 'Substantiv-Verb-Verbindungen, sein + zu + Infinitiv, -bar/-lich trong bài Leseverstehen Teil 3.',
            'content' => 'Các dạng bị động thay thế giúp rút gọn văn bản và hay xuất hiện trong đề thi đọc hiểu TELC B2.',
            'rule_points' => [
                'sein + zu + Infinitiv = kann/muss gemacht werden',
                'Adjektive auf -bar: machbar = kann gemacht werden',
            ],
            'examples' => [
                ['de' => 'Die Aufgabe ist leicht zu lösen.', 'vi' => 'Nhiệm vụ này dễ giải quyết.'],
            ],
            'status' => 'in_progress',
            'progress' => 65,
            'score' => 7.8,
            'badge_label' => 'ĐANG HỌC',
        ]);

        // 4. Seed Students
        Student::truncate();
        Student::create([
            'student_id' => 'STU-001',
            'name' => 'Nguyễn Văn Minh',
            'email' => 'minh.nguyen@example.com',
            'class_name' => 'Lớp B2-K15 Chuyên Sâu',
            'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            'target_score' => 250,
            'current_score' => 242,
            'status' => 'Đạt chuẩn TELC B2',
            'target_exam_date' => '2026-10-15',
        ]);

        Student::create([
            'student_id' => 'STU-002',
            'name' => 'Trần Thị Thu Thảo',
            'email' => 'thao.tran@example.com',
            'class_name' => 'Lớp B2-K15 Chuyên Sâu',
            'avatar_url' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
            'target_score' => 240,
            'current_score' => 218,
            'status' => 'Cần ôn thêm Viết',
            'target_exam_date' => '2026-11-01',
        ]);

        // 5. Seed Exam Results
        ExamResult::truncate();
        ExamResult::create([
            'result_id' => 'RES-9981',
            'exam_code' => 'TELC-B2-MOCK-01',
            'student_name' => 'Nguyễn Văn Minh',
            'score' => 242,
            'max_score' => 300,
            'status_text' => 'Đạt chuẩn TELC B2 (Gut)',
            'reading_score' => 68,
            'listening_score' => 65,
            'writing_score' => 54,
            'speaking_score' => 55,
            'tab_switch_count' => 0,
            'ai_feedback' => 'Bài làm rất chắc chắn. Phần Schriftlicher Ausdruck viết mạch lạc, sử dụng từ nối B2 linh hoạt.',
            'description' => 'Thi thử đợt 1 - Điểm tổng 242/300',
            'time_ago' => '10 phút trước',
            'submitted_at' => now()->subMinutes(10),
        ]);

        ExamResult::create([
            'result_id' => 'RES-9982',
            'exam_code' => 'TELC-B2-MOCK-01',
            'student_name' => 'Lê Hoàng Nam',
            'score' => 265,
            'max_score' => 300,
            'status_text' => 'Xuất Sắc (Sehr Gut)',
            'reading_score' => 72,
            'listening_score' => 70,
            'writing_score' => 61,
            'speaking_score' => 62,
            'tab_switch_count' => 0,
            'ai_feedback' => 'Kỹ năng Đọc và Nghe gần như tuyệt đối. Bố cục bài viết Beschwerdebrief đạt chuẩn mực TELC.',
            'description' => 'Thi thử đợt 1 - Điểm tổng 265/300',
            'time_ago' => '1 giờ trước',
            'submitted_at' => now()->subHour(),
        ]);
    }
}
