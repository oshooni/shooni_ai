# 인스타 카드뉴스 변환

완성된 스레드를 카드뉴스로 옮길 때 읽는다.

## 스레드와 다른 점

스레드는 위에서 아래로 읽고, 인스타는 1장에서 넘길지 말지가 결정된다. 그래서 텍스트를 그대로 옮기면 안 된다.

- 한 장에 한 문장까지 줄인다. 스레드 한 칸이 카드 한 장이 아니다.
- 표지는 상황 요약이 아니라 궁금증으로 연다. 감동은 뒤에 와도 늦지 않다.
- 반전 앞에서 장을 쪼갠다. 넘기는 맛이 여기서 나온다.
- 마지막 장이 저장과 공유를 결정한다. 정리 문장이나 CTA를 여기 둔다.
- 8~12장. 인스타는 20장까지 되지만 12장 넘으면 이탈이 급격히 는다.

## 장수 배분

| 구간 | 장수 | 역할 |
|---|---|---|
| 표지 | 1 | 넘길지 말지 결정 |
| 상황 | 1~2 | 뭘 하는 얘기인지 |
| 전개 | 4~6 | 핵심 내용, 한 장에 하나씩 |
| 정리 | 1 | 저장될 문장. 프레임이나 순서 요약 |
| CTA | 1 | 링크 안내나 왜 하는지 |

정리 장을 반드시 넣는다. 사람들이 캡처해서 가져가는 건 이 한 장이다.

## 제작 방식

HTML 파일 하나로 만들어 사용자에게 전달한다. 사용자가 브라우저로 열어 PNG로 저장한다. 환경에 따라 파일 전달 방식이 다르니 그 환경의 기본 방식을 따른다.

- 캔버스 1080×1080
- 시리즈로 만들 땐 팔레트를 고정한다. 나란히 놓았을 때 같은 계정 것으로 보여야 한다
- 시그니처 요소를 하나 정한다. 내용의 성격에서 뽑는다 — 작업 기록이면 이슈/해결 태그, 시간 순서면 날짜 레일, 비교면 좌우 분할
- html2canvas로 일괄 저장 버튼을 붙이면 편하다. cdnjs에서 불러온다

## HTML 골격

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css">
<style>
  :root{
    --paper:#F7F3EA; --ink:#1C2B22;
    --accent:#1E4433; --sub:#5C8266; --point:#F2C14E;
    --line:rgba(28,43,34,.14);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#2A2A28;padding:40px 20px;font-family:'Pretendard',sans-serif}
  .deck{max-width:1080px;margin:0 auto;display:flex;flex-direction:column;gap:36px}
  .card{
    width:1080px;height:1080px;background:var(--paper);
    padding:92px 84px;position:relative;overflow:hidden;
    display:flex;flex-direction:column;transform-origin:top left;
  }
  .eyebrow{font-size:24px;font-weight:700;letter-spacing:.14em;color:var(--sub);margin-bottom:34px}
  h1{font-size:104px;line-height:1.16;letter-spacing:-.035em;font-weight:800;color:var(--accent)}
  h2{font-size:74px;line-height:1.24;letter-spacing:-.03em;font-weight:800;color:var(--ink)}
  .body{font-size:40px;line-height:1.62;letter-spacing:-.02em;color:#3B4A41;font-weight:500}
  .mt-l{margin-top:44px}
  .hl{background:linear-gradient(transparent 58%,rgba(242,193,78,.55) 58%)}
  .pager{position:absolute;right:84px;bottom:72px;font-size:22px;font-weight:600;color:var(--sub)}
  .brandline{position:absolute;left:84px;bottom:72px;font-size:22px;font-weight:600;color:var(--sub)}
  .dark{background:var(--accent)}
  .dark h1,.dark h2{color:var(--paper)}
  .dark .body{color:rgba(247,243,234,.84)}
  .dark .eyebrow{color:var(--point)}
  .dark .pager,.dark .brandline{color:rgba(247,243,234,.58)}
</style>
</head>
<body>
<div class="toolbar"><button id="save">PNG 저장</button></div>
<div class="deck" id="deck">
  <section class="card dark">
    <div class="eyebrow">시리즈명</div>
    <h1>표지<br>문장</h1>
    <div class="body mt-l">한 줄 더</div>
    <div class="brandline">계정명</div>
    <div class="pager">01</div>
  </section>
  <!-- 나머지 카드 -->
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script>
  function fit(){
    const w=document.getElementById('deck').clientWidth, s=Math.min(1,w/1080);
    document.querySelectorAll('.card').forEach(c=>{
      c.style.transform='scale('+s+')';
      c.style.marginBottom=(1080*s-1080)+'px';
    });
  }
  fit(); window.addEventListener('resize',fit);
  document.getElementById('save').addEventListener('click',async()=>{
    const btn=document.getElementById('save'), cards=document.querySelectorAll('.card');
    if(typeof html2canvas==='undefined'){btn.textContent='저장 실패 — 직접 캡처';return;}
    cards.forEach(c=>c.style.transform='scale(1)');
    for(let i=0;i<cards.length;i++){
      btn.textContent=(i+1)+' / '+cards.length;
      try{
        const canvas=await html2canvas(cards[i],{scale:1,useCORS:true});
        const a=document.createElement('a');
        a.download='card-'+String(i+1).padStart(2,'0')+'.png';
        a.href=canvas.toDataURL('image/png'); a.click();
        await new Promise(r=>setTimeout(r,350));
      }catch(e){btn.textContent='저장 실패 — 직접 캡처';fit();return;}
    }
    btn.textContent='PNG 저장'; fit();
  });
</script>
</body>
</html>
```

## 캡션

카드뉴스와 별개로 인스타 본문을 함께 준다.

- 첫 두 줄이 미리보기에서 잘리는 구간이라 훅을 앞에 박는다
- 스레드 본문을 그대로 붙이지 말고 존댓말로 풀어 다시 쓴다
- CTA는 하나만. 두 개면 힘이 분산된다
- 댓글로 링크를 보내는 방식이면 키워드를 짧고 고유하게 정한다. 본문에 반복해서 나오는 단어가 좋다
- 해시태그는 10~15개. 주제어와 타깃 직군을 섞는다

## 저작권

언론사 보도사진, 연예인 사진, 다른 계정이 만든 카드뉴스를 그대로 올리면 안 된다. 인용이 필요하면 원문 기사나 영상 링크를 걸고, 이미지는 직접 만든 것이나 사용 허락이 있는 것만 쓴다.
