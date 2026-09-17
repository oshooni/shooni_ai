# shooni_ai

노슈니(오수인)가 실제로 쓰는 콘텐츠 제작 스킬 모음입니다. 스레드 글쓰기 3종과 SEO 블로그 글쓰기 1종.

스킬은 "이럴 땐 이렇게 해라"를 적어둔 문서입니다. Claude가 해당 작업을 할 때 이 문서를 읽고 그 방식대로 일합니다. 프롬프트를 매번 길게 쓰지 않아도 되고, 결과의 결이 일정해집니다.

## 들어 있는 스킬

| 스킬 | 하는 일 | 언제 쓰나 |
|---|---|---|
| `threads-core` | 계정의 코어(목적·타겟·관점·컨셉·말투·전환)를 인터뷰로 잡아 `my-threads-core.md` 파일로 만듭니다 | 스레드를 시작할 때 맨 처음. 글이 잘 나오는데 내 글 같지 않을 때 |
| `threads-material` | 소재를 파내고 쌓습니다. 내 서사 재고를 `my-story-bank.md`에 정리하고, 외부 사례를 붙여 후킹 소재로 만듭니다 | 쓸 게 떨어졌을 때, 오늘 뭘 쓸지 모르겠을 때 |
| `threads-writing` | 스레드 글을 훅 구조로 설계해 칸 단위로 씁니다. 훅 후보 3개를 먼저 보여주고 고르면 전체를 완성합니다 | 실제로 글을 쓸 때 |
| `blog-writing` | 검색 의도에 맞는 노션 SEO 블로그 글을 씁니다 | 블로그 장문을 쓸 때 |

`threads-writing`은 참고 파일 세 개를 함께 씁니다.

- `references/hooks.md` — 훅 유형 카탈로그와 실제 예시
- `references/topic-mining.md` — 소재가 없을 때 아이디어를 뽑는 프레임
- `references/cardnews.md` — 스레드를 인스타 카드뉴스로 바꾸는 방법과 HTML 템플릿

## 추천 순서

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

폴더 구조는 그대로 유지해야 합니다. 특히 `threads-writing`은 안에 있는 `references` 폴더까지 같이 옮겨야 정상 동작합니다.

```
~/.claude/skills/
├── blog-writing/SKILL.md
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
