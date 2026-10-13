/**
 * 신청이 들어오면 자동 메일 — 지메일 무료 버전
 * 수퍼베이스 테이블에 새 줄이 생기면
 *   1) 신청자에게 확인 메일
 *   2) 나에게 새 신청 알림 메일
 * 내 지메일로 보내요. 개인 지메일 기준 하루 100명까지 무료.
 *
 * 원작: 노슈니(오수인) · CC BY 4.0 · https://github.com/oshooni/shooni_ai
 * 고쳐 쓰거나 나눌 때는 이 출처를 남겨주세요.
 */

// ════════════════════════════════════════════════════════════
// 처음 한 번만 실행 (위 메뉴에서 "설치하기"를 고르고 ▶ 실행)
// 이 함수가 파일 맨 위에 있어야 실행 메뉴에서 기본으로 골라져요.
// ════════════════════════════════════════════════════════════
function 설치하기() {
  // 허용 창에서 체크를 빠뜨린 권한이 있으면 허용 창을 다시 띄운다
  ScriptApp.requireAllScopes(ScriptApp.AuthMode.FULL);
  if (!열쇠('HOOK_KEY')) {
    PropertiesService.getScriptProperties().setProperty('HOOK_KEY', Utilities.getUuid().replace(/-/g, ''));
  }
  // 내 메일함으로 미리보기 두 통 (신청자용, 알림용)
  const 샘플 = {};
  샘플[CONFIG.fields.name] = '테스트';
  샘플[CONFIG.fields.email] = 나();
  처리(샘플);
  console.log('HOOK_KEY=' + 열쇠('HOOK_KEY'));
}

// ════════════════════════════════════════════════════════════
// ① 내 가게 정보 — 여기를 고쳐요
// ════════════════════════════════════════════════════════════
const CONFIG = {
  shopName: '내 가게 이름',            // 메일함에 "보낸 사람"으로 보이는 이름
  table: 'applications',              // 신청이 쌓이는 수퍼베이스 테이블 이름
  fields: {
    name: 'name',                     // 신청자 이름 칸
    email: 'email',                   // 신청자 이메일 칸
  },
  notifyOwner: true,                  // 나에게도 새 신청 알림을 받을지
  ownerEmail: '',                     // 알림 받을 메일 (비우면 이 구글 계정)
  hideInAlert: ['id'],                // 알림 메일에서 뺄 칸
};

// ② 신청자에게 갈 메일 — 내 신청 페이지에 실제로 적힌 사실만 넣어요
//    결제 전에 신청이 저장되는 구조라면 "신청 완료"가 아니라 "신청서 접수"로 써요
function 신청자메일(r) {
  const 이름 = r[CONFIG.fields.name] || '신청자';
  return {
    subject: `[${CONFIG.shopName}] ${이름}님, 신청서를 받았어요`,   // 제목은 글자 그대로
    html: `<p>${esc(이름)}님, ${esc(CONFIG.shopName)} 신청서를 잘 받았어요 🙌</p>
      <p style="background:#f5f0ff;padding:12px 14px;border-radius:8px">
        일정: (여기에 일정)<br>
        장소: (여기에 장소 또는 안내 방법)</p>
      <p>(여기에 다음 단계. 예: 결제까지 마치셔야 자리가 확정돼요)</p>
      <p>궁금한 점은 이 메일에 답장으로 물어봐 주세요.</p>
      <p>(여기에 맺음말과 이름)</p>`,
  };
}

// ════════════════════════════════════════════════════════════
// 여기부터는 고치지 않아도 돼요
// ════════════════════════════════════════════════════════════
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const 나 = () => CONFIG.ownerEmail || Session.getEffectiveUser().getEmail();
const 열쇠 = (k) => PropertiesService.getScriptProperties().getProperty(k);
const 응답 = (o) => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

function 보내기(to, mail, replyTo) {
  const html = `<div style="font-family:sans-serif;line-height:1.7;color:#222;max-width:540px">${mail.html}</div>`;
  GmailApp.sendEmail(to, mail.subject, html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), {
    htmlBody: html, name: CONFIG.shopName, replyTo: replyTo || 나(),
  });
}

function 알림메일(r) {
  const rows = Object.keys(r)
    .filter((k) => CONFIG.hideInAlert.indexOf(k) < 0)
    .map((k) => `<tr><td style="padding:4px 12px 4px 0;color:#888">${esc(k)}</td><td>${esc(r[k])}</td></tr>`)
    .join('');
  return {
    subject: `[새 신청] ${r[CONFIG.fields.name] || '이름 없음'}`,
    html: `<p>새 신청이 들어왔어요 📬</p><table>${rows}</table>`,
  };
}

// 수퍼베이스 웹훅(초인종)이 부르는 곳
function doPost(e) {
  const key = 열쇠('HOOK_KEY');
  if (!key || !e || !e.parameter || e.parameter.key !== key) return 응답({ error: 'unauthorized' });
  let body;
  try { body = JSON.parse((e.postData && e.postData.contents) || '{}'); } catch (err) { return 응답({ error: 'bad json' }); }
  if (body.type !== 'INSERT' || body.table !== CONFIG.table || !body.record) return 응답({ skipped: true });
  return 응답(처리(body.record));
}

function 처리(r) {
  const result = {};
  const email = r[CONFIG.fields.email];
  try {
    if (email) {
      보내기(email, 신청자메일(r));
      result.applicant = 'sent';
    } else {
      result.applicant = 'no email';
    }
  } catch (err) { console.error(err); result.applicant = String(err.message || err); }
  if (CONFIG.notifyOwner) {
    try { 보내기(나(), 알림메일(r), email || undefined); result.owner = 'sent'; }
    catch (err) { console.error(err); result.owner = String(err.message || err); }
  }
  return result;
}
