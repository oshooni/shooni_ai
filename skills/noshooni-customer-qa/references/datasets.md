# 국가별 데이터셋 — 한국 밖을 볼 때

> 이 스킬의 기본값은 Nemotron-Personas-Korea다.
> 타깃이 한국이 아니면 데이터셋을 바꿔야 한다. 한국 데이터로 해외를 추정하지 않는다.

---

## 1. 왜 바꿔야 하나

페르소나 서술은 각 나라 모국어 원문이고, 조건도 그 나라 통계에 정렬돼 있다.
번역본이 아니라서, 한국 페르소나에게 해외 서비스를 물으면 말투·생활 조건·소비 맥락이 전부 한국 것으로 나온다.

> "몇 %인가"를 못 잡는 데이터인데, 나라까지 틀리면 "무엇을 놓쳤는가"도 못 잡는다.

---

## 2. 쓸 수 있는 나라 — 10종

전부 무료 · CC BY 4.0 · 출처 표기하면 상업적 사용 가능.

| 국가 | 저장소 | 레코드(사람) | 언어 |
|---|---|---:|---|
| 🇰🇷 한국 ★기본값 | `nvidia/Nemotron-Personas-Korea` | 1M | 한국어 |
| 🇺🇸 미국 | `nvidia/Nemotron-Personas-USA` | 1M | American English |
| 🇯🇵 일본 | `nvidia/Nemotron-Personas-Japan` | 1M | 일본어 |
| 🇮🇳 인도 | `nvidia/Nemotron-Personas-India` | 3M | 힌디 · Indian English |
| 🇧🇷 브라질 | `nvidia/Nemotron-Personas-Brazil` | 1M | 브라질 포르투갈어 |
| 🇫🇷 프랑스 | `nvidia/Nemotron-Personas-France` | 1M | 프랑스어 |
| 🇸🇬 싱가포르 | `nvidia/Nemotron-Personas-Singapore` | 148k | English |
| 🇸🇻 엘살바도르 | `nvidia/Nemotron-Personas-El-Salvador` | 148k | 엘살바도르 스페인어 |
| 🇻🇳 베트남 | `nvidia/Nemotron-Personas-Vietnam` | 100k | 베트남어 |
| 🇧🇪 벨기에 | `nvidia/Nemotron-Personas-Belgium` | ⚠️ 표기 불일치 | — |

컬렉션 전체 → <https://huggingface.co/collections/nvidia/nemotron-personas>

> ⚠️ 벨기에판만 레코드(1.2M)와 페르소나(300k) 표기가 어긋난다. 쓰기 전 데이터셋 카드를 직접 확인한다.

### 「페르소나 수」와 「레코드 수」를 혼동하지 않는다

레코드 = 사람 수 · 페르소나 = 서술문 개수다.

```
한국  100만 명 × 7개 렌즈 = 700만 개 서술
일본  100만 명 × 6개 렌즈 = 600만 개 서술
```

"700만 명"이 아니라 "100만 명"이다. 결과를 보고할 때 자주 틀리는 지점이니, 사람 수로 말할 때는 레코드 수를 쓴다.

---

## 3. 나라를 바꾸면 같이 바뀌는 것 — 코드 수정 전 체크 4가지

- [ ] 지리 필드명 — 나라마다 다르다 (아래 표)
- [ ] `family_persona` 유무 — 한국판에만 있다. 없으면 `marital_status`로 대체
- [ ] 직업 분류 체계 — 나라마다 다르다. 한국은 KSCO 계열이라 "소규모 상점 경영자" 같은 정형 표현을 쓴다
- [ ] 필터 키워드 언어 — 서술이 모국어라 키워드도 그 언어로 다시 쓴다

### 지리 해상도

| 국가 | 지리 필드 | 해상도 | 예시 |
|---|---|---|---|
| 🇰🇷 한국 | `province`(17) · `district`(252) | 시군구 | 광주 / 광주-서구 |
| 🇺🇸 미국 | `city` · `state`(52) · `zipcode` · `country` | 우편번호 | 브루클린 · NY · 11201 |
| 🇯🇵 일본 | `region` · `area` · `prefecture` · `country` | 도도부현 | 간토 · 東日本 · 도쿄 |

미국판이 가장 촘촘하다. "뉴욕주 브루클린 11201 지역의 30대" 같은 조건이 실제로 걸린다.

### 렌즈 · 필드 수 대조 (실측)

| | 🇰🇷 한국 | 🇯🇵 일본 | 🇺🇸 미국 |
|---|:---:|:---:|:---:|
| 렌즈 합계 | 7 | 6 | 6 |
| `family_persona` | ✅ | ❌ | ❌ |
| `military_status` | ✅ | ❌ | ❌ |
| `family_type` · `housing_type` | ✅ | ❌ | ❌ |
| `bachelors_field` | ✅ | ❌ | ✅ |
| 총 필드 수 | 26 | 21 | 23 |

> 한국판이 가장 필드가 많다. 해외로 옮기면 조건이 줄어드니, 한국에서 쓰던 필터를 그대로 옮기면 빈 결과가 나온다.

---

## 4. 받는 법

### A. 브라우저에서 조각 하나만 — 대체로 이걸로 충분

```
https://huggingface.co/datasets/nvidia/Nemotron-Personas-Korea/tree/main/data
```

한국판 기준 9조각 × 약 220MB, 조각당 약 11만 명.

```
https://huggingface.co/datasets/nvidia/Nemotron-Personas-Korea/resolve/main/data/train-00000-of-00009.parquet
```

*(나라를 바꾸려면 URL의 `Korea`를 해당 저장소 이름으로 교체한다)*

### B. 스트리밍

```python
from datasets import load_dataset
ds = load_dataset("nvidia/Nemotron-Personas-USA", split="train", streaming=True)
```

### C. 받아둔 parquet 읽기 — 네트워크 불필요

```python
import pyarrow.parquet as pq
pf = pq.ParquetFile("train-00000-of-00009.parquet")
for batch in pf.iter_batches(batch_size=1000):
    for row in batch.to_pylist():
        ...
```

> 허깅페이스 접속이 막힌 환경에서는 C가 유일한 경로다. 파일만 옮겨두면 그 뒤로는 인터넷 없이 돌아간다.

---

## 5. 몇 명을 뽑아둘까

| 단계 | 인원 | 용도 |
|---|---|---|
| 코어 팩 | 30~50명 | 즉시 사용 (이 스킬의 L1) |
| 확장 팩 | 1,000~5,000명 | 조건 검색용 (L2) |
| 전체 | 원본 100만 | 아주 정밀한 조건일 때만 |

포화점은 1,000명이다. 조건 3~4개짜리 좁은 타깃 15개로 실측한 결과 —

| 풀 크기 | 조건에 맞는 2명 확보 성공률 |
|---:|---|
| 250명 | 66.7% |
| 500명 | 86.7% |
| 1,000명 | 100% ← 포화 |
| 3,000명 | 100% |

뽑을 때 두 가지를 지킨다.

1. 같은 직업이 몰리지 않게 상한을 둔다 — 안 그러면 "부동산 중개사"만 30명 나온다
2. 씨앗(seed)을 고정한다 — 같은 조건에 같은 사람이 나와야 수정 전후 비교가 성립한다

---

## 6. 나라를 바꿔도 안 바뀌는 한계

어느 나라 데이터셋이든 아래는 동일하다. 자세한 내용은 `references/SPEC.md`.

### 없는 필드

소득 · 자산 · 구매력 / 성격 지표(Big Five) / 디지털 숙련도 / 건강 지표 / 이름(서술 안에 섞여 있음)

> 소득이 없다는 게 가격 검증의 최대 제약이다. "이 가격이면 살까"를 물을 수는 있지만,
> 답은 소비 습관 서술에서 읽은 추정이지 실제 구매력이 아니다.

### 통계적 대표성이 없다

공식 통계에 정렬(aligned)된 생성물이지, 인구를 조사한 표본이 아니다.

| 하면 안 되는 것 | 왜 |
|---|---|
| "사용자의 40%가 이탈합니다" | 확률 표본이 아니다 |
| "이 가격이면 X%가 삽니다" | 소득 필드가 없다 |
| A/B 테스트 대체 | 실제 트래픽 실험을 대신할 수 없다 |

> 한 줄로 — "몇 %인가"가 아니라 "무엇을 놓쳤는가"에 답하는 데이터다.
> 한 명이 막히면 그 지점은 실재한다. 몇 %인지 모를 뿐이다.

---

## 7. 결과에 붙이는 출처 문장

```
이 결과는 공식 통계에 정렬된 합성 페르소나 N명을 대상으로 한 정성 조사입니다.
확률 표본이 아니므로 비율·빈도로 해석할 수 없으며, 실제 고객 검증을 대체하지 않습니다.
데이터: NVIDIA Nemotron-Personas-{국가} (CC BY 4.0)
https://huggingface.co/datasets/nvidia/Nemotron-Personas-{국가}
```

라이선스 — CC BY 4.0 · 상업적 사용 ⭕ · 수정·재배포 ⭕ · 조건은 출처 표기 · 개인정보 해당 없음

> 직접 확인한 것은 한국 · 일본 · 미국 3종이다. 나머지 7개국도 같은 컬렉션이라 동일할 가능성이 높지만,
> 사용 전 각 데이터셋 카드에서 라이선스를 직접 확인한다.
