-- 신청 테이블에 새 줄이 생기면 구글 앱스 스크립트(메일 비서)에 알리는 초인종
-- 바꿀 곳 네 군데: 트리거 이름, 테이블 이름, 웹 앱 주소, 암호(key)
-- 실행 전 수퍼베이스 Integrations → Database Webhooks 가 켜져 있어야 해요

create trigger "applications_mail"
after insert on public.applications
for each row
execute function supabase_functions.http_request(
  'https://script.google.com/macros/s/웹앱_배포_ID/exec',
  'POST',
  '{"Content-type":"application/json"}',
  '{"key":"설치하기_실행_로그의_HOOK_KEY"}',
  '5000'
);

-- 끄고 싶을 때 (메일 자동 발송 중지):
-- drop trigger if exists "applications_mail" on public.applications;
