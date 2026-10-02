# shooni_ai

노슈니(오수인)가 실제로 쓰는 스킬 모음입니다. 비즈니스 코어 잡기 1종, 가상 고객 검증 1종, 스레드 글쓰기 3종, SEO 블로그 글쓰기 1종.

스킬은 "이럴 땐 이렇게 해라"를 적어둔 문서입니다. Claude가 해당 작업을 할 때 이 문서를 읽고 그 방식대로 일합니다. 프롬프트를 매번 길게 쓰지 않아도 되고, 결과의 결이 일정해집니다.

## 들어 있는 스킬

| 스킬 | 하는 일 | 언제 쓰나 |
|---|---|---|
| `noshooni-core` | 비즈니스의 코어(내가 가진 재료 + 내가 파는 것이 만드는 변화)를 한 번에 한 질문씩 인터뷰로 세우고, "우리는 ___를 파는 게 아니라 ___를 판다" 한 문장과 코어 한 장으로 정리합니다. 제품이 있든, 계획만 있든, 아무것도 없든 다 됩니다 | 뭘 팔아야 할지 모르겠을 때. 가치·페르소나·카피를 잡기 전 맨 처음 |
| `noshooni-customer-qa` | 한국 인구통계에 맞춘 합성 페르소나 3,000명 중에서 가상 고객 패널을 불러 상품·상세페이지·가격에 대한 반응을 듣고(인터뷰), 신청·결제 흐름에서 어디서 막히는지 직접 시켜봅니다(QA). 수락·조건부·거절을 같은 무게로 다루고, 모든 판정에 근거를 붙입니다 | 코어를 세운 직후, 상세페이지를 공개하기 전, 결제를 붙인 뒤 |
| `threads-core` | 계정의 코어(목적·타겟·관점·컨셉·말투·전환)를 인터뷰로 잡아 `my-threads-core.md` 파일로 만듭니다 | 스레드를 시작할 때 맨 처음. 글이 잘 나오는데 내 글 같지 않을 때 |
| `threads-material` | 소재를 파내고 쌓습니다. 내 서사 재고를 `my-story-bank.md`에 정리하고, 외부 사례를 붙여 후킹 소재로 만듭니다 | 쓸 게 떨어졌을 때, 오늘 뭘 쓸지 모르겠을 때 |
| `threads-writing` | 스레드 글을 훅 구조로 설계해 칸 단위로 씁니다. 훅 후보 3개를 먼저 보여주고 고르면 전체를 완성합니다 | 실제로 글을 쓸 때 |
| `blog-writing` | 검색 의도에 맞는 노션 SEO 블로그 글을 씁니다 | 블로그 장문을 쓸 때 |

`noshooni-core`는 참고 파일 세 개를 함께 씁니다.

- `references/interview-branch.md` — 유형별(제품 있음 / 계획 있음 / 아직 없음) 인터뷰 질문 세트
- `references/examples.md` — 유형별 완성 예시 3종
- `references/output-template.md` — 코어 한 장 출력 양식

`noshooni-customer-qa`는 참고 파일과 데이터를 함께 씁니다.

- `references/` — 판정 규칙, QA 플레이북, 패널 구성 규칙, 완성 예시
- `references/extended-pack/` — 가상 고객 3,000명 데이터 (NVIDIA Nemotron-Personas-Korea, CC BY 4.0)
- `scripts/find_personas.py` — 조건으로 패널을 뽑는 검색기 (네트워크 불필요)

`threads-writing`도 참고 파일 세 개를 함께 씁니다.

- `references/hooks.md` — 훅 유형 카탈로그와 실제 예시
- `references/topic-mining.md` — 소재가 없을 때 아이디어를 뽑는 프레임
- `references/cardnews.md` — 스레드를 인스타 카드뉴스로 바꾸는 방법과 HTML 템플릿

## 추천 순서

판매 쪽은 이렇게 이어집니다.

```
noshooni-core  →  noshooni-customer-qa  →  고쳐서 배포  →  다시 noshooni-customer-qa (라이브 QA)
 코어 세우기         가상 고객 검증                          왕복 닫기
```

스레드 쪽은 이렇게 씁니다.

1. `threads-core`로 코어 파일을 먼저 만듭니다. 이게 없으면 나머지 스킬이 남의 글을 씁니다.
2. `threads-material`로 소재 창고를 채웁니다.
3. `threads-writing`으로 글을 씁니다. 이때 1번에서 만든 코어 파일을 대화에 같이 올립니다.

핵심은 이 분리입니다. 방식은 스킬에, 재료(내 말투·내 타겟·내 소재)는 내 파일에. 그래서 남이 만든 스킬을 써도 내 글이 나옵니다.

## 설치 방법

### Claude Code

이 저장소를 받아서 `skills` 폴더 안의 원하는 스킬 폴더를 `~/.claude/skills/` 아래로 복사합니다.

```bash
git clone https://github.com/oshooni/shooni_ai.git
mkdir -p ~/.claude/skills
cp -r shooni_ai/skills/* ~/.claude/skills/
```

특정 프로젝트에서만 쓰려면 `~/.claude/skills/` 대신 그 프로젝트의 `.claude/skills/`에 넣습니다.

폴더 구조는 그대로 유지해야 합니다. 특히 `noshooni-core`, `noshooni-customer-qa`, `threads-writing`은 안에 있는 `references` 폴더까지 같이 옮겨야 정상 동작합니다.

```
~/.claude/skills/
├── blog-writing/SKILL.md
├── noshooni-core/
│   ├── SKILL.md
│   └── references/
│       ├── interview-branch.md
│       ├── examples.md
│       └── output-template.md
├── noshooni-customer-qa/
│   ├── SKILL.md
│   ├── LICENSE
│   ├── CHANGES.md
│   ├── references/
│   │   ├── verdict-rules.md · qa-playbook.md · panel-rules.md 외
│   │   └── extended-pack/      (가상 고객 3,000명)
│   └── scripts/find_personas.py
├── threads-core/SKILL.md
├── threads-material/SKILL.md
└── threads-writing/
    ├── SKILL.md
    └── references/
        ├── hooks.md
        ├── topic-mining.md
        └── cardnews.md
```

### Claude 앱(웹·데스크톱)

스킬 폴더를 zip으로 압축한 뒤 설정의 스킬(Capabilities/Skills) 화면에서 업로드합니다.

```bash
cd shooni_ai/skills
zip -r threads-writing.zip threads-writing
```

### 그냥 프롬프트로 쓰기

스킬 기능을 쓰지 않아도 됩니다. `SKILL.md` 내용을 복사해 대화 맨 앞에 붙이고 "이 기준대로 써줘"라고 해도 거의 같은 결과가 나옵니다.

## 사용 예시

```
내가 뭘 파는 건지 모르겠어. 코어부터 잡아줘.
```

```
이 상세페이지 가상 고객한테 먼저 보여주고 반응 알려줘.
```

```
(배포한 주소)
신청부터 결제 직전까지 직접 눌러보고 어디서 막히는지 봐줘.
```

```
스레드 계정 코어부터 잡고 싶어. threads-core로 진행해줘.
```

```
(my-threads-core.md 첨부)
이 소재로 스레드 글 써줘. 어제 수강생이 한 말이 계속 남아서.
```

```
쓸 게 없어. 소재 좀 파내줘.
```

## 고쳐 쓰기

내 계정에 맞게 고쳐 쓰는 걸 전제로 만들었습니다. 특히 이런 부분은 사람마다 다릅니다.

- `threads-core`의 말투 금지 목록 — 내가 실제로 쓰는 표현이면 빼세요
- `threads-writing`의 칸 수와 구조 규칙
- `references/cardnews.md`의 색 팔레트와 폰트

고친 내용은 `CHANGES.md`에 적어두면 원본이 업데이트됐을 때 비교하기 쉽습니다.

## 라이선스

CC BY 4.0. 출처를 표기하면 상업적 이용을 포함해 자유롭게 쓰고 고치고 재배포할 수 있습니다.

원작: 노슈니(오수인)
표기 예시: `이 스킬은 노슈니(오수인)의 shooni_ai 스킬을 기반으로 합니다. (CC BY 4.0) https://github.com/oshooni/shooni_ai`

자세한 조건은 [LICENSE](LICENSE) 파일을 보세요.

예외 — `noshooni-customer-qa`는 셀피쉬클럽의 [virtual-customer-feedback-qa](https://github.com/selfishclub/virtual-customer-feedback-qa)(MIT)를 노슈니가 각색한 것입니다. 스크립트와 원작 부분은 MIT, 노슈니가 고친 문서는 CC BY 4.0, 페르소나 데이터는 NVIDIA Nemotron-Personas-Korea(CC BY 4.0)를 따릅니다. 자세한 내용은 그 폴더의 `LICENSE`와 `CHANGES.md`에 있습니다.
