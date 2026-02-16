# AI 레시피 추천 서비스 "ReciiPick" 개발 프롬프트
# 언어는 영어 기반입니다.

## 📋 프로젝트 개요
AI를 활용하여 사용자가 입력한 재료(텍스트 또는 이미지)를 기반으로 맞춤형 레시피를 추천하는 웹 애플리케이션

---

## 🎯 핵심 기능 요구사항

### 1. 재료 입력 시스템
- **텍스트 입력**: 사용자가 직접 재료명 입력 (예: "양파, 계란, 치즈")
- **이미지 업로드**: 냉장고/재료 사진을 업로드하여 AI가 재료 인식
- **이미지 미리보기**: 업로드한 이미지를 UI에 표시, 삭제 가능
- **빠른 제안 태그**: 사전 정의된 태그 클릭으로 빠른 입력 (예: "🥚 간단한 아침", "🍝 15분 요리", "🥗 다이어트", "🍺 술안주")

### 2. AI 레시피 생성 (Claude API 연동)
```javascript
// API 엔드포인트
POST https://api.anthropic.com/v1/messages

// 요청 구조
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": [
        // 텍스트 입력 시
        { "type": "text", "text": "재료: 양파, 계란, 치즈로 만들 수 있는 레시피 추천" }
        
        // 이미지 업로드 시
        { "type": "image", "source": { "type": "base64", "media_type": "image/jpeg", "data": "..." } },
        { "type": "text", "text": "이 사진의 재료로 만들 수 있는 레시피 추천" }
      ]
    }
  ]
}
```

**중요**: API 키는 환경변수나 백엔드에서 관리 (프론트엔드에 노출 금지)

### 3. 레시피 응답 형식

**중요**: AI는 친근한 요리사 캐릭터로서 **자연스러운 대화체**로 응답해야 합니다. JSON 형식이 아닌, 실제 요리사가 이야기하듯이 답변합니다.

#### 응답 스타일 가이드
- 반말 사용 (친근하고 편안한 톤)
- 이모지 적극 활용 🍳👨‍🍳✨
- 요리 팁과 격려를 자연스럽게 섞어서
- 단계별로 끊어서 설명 (가독성)
- 사용자 재료에 대한 칭찬이나 코멘트 포함

#### 응답 예시

```
오! 양파랑 계란이 있구나! 👀 완전 좋은 조합이야~

그럼 **양파 계란 볶음** 어때? 15분이면 뚝딱 만들 수 있어! 🍳

📸 [AI 생성 이미지: 노릇하게 볶아진 양파 계란 볶음 요리 사진]

**필요한 재료** (2인분 기준)
• 양파 1개 (중간 크기)
• 계란 3개
• 식용유 1큰술
• 소금 약간 (간 맞추기용)

**만드는 법**

1️⃣ **양파 준비** (3분)
양파를 반으로 자르고 얇게 채썰어줘. 눈물 나는 거 싫으면 물에 잠깐 담갔다가 써도 돼!

2️⃣ **계란 풀기** (1분)
계란 3개를 볼에 깨서 잘 풀어줘. 소금을 살짝 넣고 섞으면 더 맛있어 🧂

3️⃣ **양파 볶기** (5분)
팬에 기름 두르고 중불로 달궈. 양파를 넣고 투명해질 때까지 볶아줘. 이때가 진짜 중요해!

4️⃣ **계란 넣기** (3분)
양파가 익으면 계란을 부어. 주걱으로 천천히 섞으면서 익혀줘. 너무 오래 익히면 퍽퍽해지니까 조심!

**꿀팁 💡**
중불에서 천천히 익히면 계란이 훨씬 부드러워! 급하게 강불로 하면 타거나 딱딱해질 수 있어. 그리고 마지막에 참기름 몇 방울 떨어뜨리면 풍미가 배가 돼 ✨

아침 메뉴로도 좋고, 간단한 반찬으로도 최고야! 혹시 다른 재료 더 있어? 그럼 거기에 맞춰서 업그레이드 버전도 알려줄게 😊
```

#### 이미지 생성 요구사항

각 레시피 답변마다 **요리 완성 사진**을 AI가 생성해서 포함해야 합니다.

**이미지 생성 방법 옵션**:

**Option 1: DALL-E API 사용 (추천)**
```javascript
// OpenAI DALL-E 3 API 호출
const generateRecipeImage = async (recipeName) => {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: `A professional, appetizing photo of ${recipeName}, food photography, top view, warm lighting, on a white plate, restaurant quality, detailed texture`,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    })
  });
  return response.json();
};
```

**Option 2: Stable Diffusion API**
- Replicate, Stability AI 등의 서비스 활용
- 프롬프트: "professional food photography, [요리명], appetizing, warm lighting, high detail"

**Option 3: Unsplash API (대안)**
- 실제 음식 사진 라이브러리에서 검색
- 무료이지만 정확한 레시피와 일치하지 않을 수 있음

**이미지 표시 위치**:
- 레시피 제목 바로 아래
- 둥근 모서리 (rounded-xl)
- 그림자 효과 (shadow-lg)
- 최대 너비 400px, 높이 자동 비율

**프롬프트 엔지니어링 팁**:
```
"당신은 친근한 요리사 캐릭터입니다. 사용자의 재료를 보고 자연스러운 대화체로 레시피를 추천해주세요.

- 반말로 편하게 이야기하기
- 이모지 적극 활용
- 요리 과정을 단계별로 끊어서 설명
- 실용적인 팁 포함
- 격려와 응원의 메시지
- 추가 질문 유도 (다른 재료 있는지 등)

레시피 설명 전에 반드시 요리 완성 사진을 생성해서 보여주세요.
이미지 프롬프트: 'professional food photography of [요리명], appetizing, warm lighting, top view'
"
```

### 4. 대화형 인터페이스
- **메시지 히스토리**: 사용자 질문 + AI 답변을 대화창에 누적 표시
- **말풍선 UI**: 사용자 메시지는 오른쪽, AI 답변은 왼쪽에 표시
- **애니메이션**: 새 메시지가 나타날 때 슬라이드 업 효과
- **스크롤**: 메시지가 많아지면 자동 스크롤

### 5. 레시피 저장 기능
- **북마크**: 마음에 드는 레시피를 로컬 스토리지에 저장
- **저장된 레시피 목록**: 사이드바에서 조회 가능
- **개수 표시**: 저장된 레시피 개수를 사이드바에 배지로 표시

---

## 🎨 UI/UX 디자인 명세

### 레이아웃 구조
```
┌─────────────────────────────────────────────────────┐
│  [Sidebar]  │         Main Content                  │
│             │                                       │
│  - Saved    │    [Floating Food Emojis]            │
│    Recipes  │                                       │
│  - Settings │    [Messages History]                │
│  - Login    │                                       │
│             │    [Chef Character] [Speech Bubble]  │
│             │         ▼                             │
│             │    [Input Box with Camera & Send]    │
│             │                                       │
└─────────────────────────────────────────────────────┘
```

### 1. 사이드바 (왼쪽, 고정)
**요구사항**:
- 너비: 288px (w-72)
- 배경: 반투명 그라데이션 (from-amber-50/95 to-orange-50/95) + backdrop-blur
- 접기/펼치기 토글 버튼 (화면 왼쪽 중앙에 배치)
- 내비게이션 항목들은 호버 시 확대/회전 효과

**내비게이션 메뉴**:
- 📚 저장된 레시피 (개수 배지 표시)
- ⚙️ 설정 (호버 시 기어 회전 애니메이션)
- 🔐 로그인/로그아웃 (상태 토글)

**최근 레시피 섹션**:
- 저장된 레시피가 있을 때만 표시
- 최대 3개까지 프리뷰
- 클릭하면 해당 레시피로 이동

### 2. 배경화면
**요구사항**:
- SVG 그라데이션: 따뜻한 오렌지/복숭아색 톤 (#FFF5EB → #FFEBDC → #FFE4C4)
- 음식 패턴: 반투명 원형과 곡선으로 구성된 추상적 패턴
- 떠다니는 요소: 8개의 음식 이모지 (🍳🥘🍕🥗🍝🥙🍲🧆)가 천천히 부유하는 애니메이션
- 애니메이션: 각 이모지마다 랜덤한 위치, 속도, 딜레이로 float 효과

### 3. 요리사 캐릭터 (핵심!)
**위치**: 말풍선 박스 왼쪽 위, 상대적 위치 (-top-20 left-8)

**구성 요소**:
- **요리사 모자**: 
  - 흰색 둥근 모자 + 주황색 테두리
  - AI가 답변할 때 좌우로 흔들리는 애니메이션 (`chef-hat-wave`)
  
- **얼굴**:
  - 크기: 80px × 80px 원형
  - 배경: 베이지색 그라데이션 (from-amber-100 to-amber-200)
  - 테두리: 4px 주황색 (border-orange-400)
  
- **표정**:
  - 눈: 두 개의 작은 원 (2.5px, 간격 12px)
  - 입: 반원 형태 (border-b-3)
  - **중요**: AI 응답 중일 때 입이 위아래로 움직이는 애니메이션 (`speaking-animation`)
  - 볼: 양쪽 볼에 반투명 빨간색 원 (불러낵 효과)

- **로딩 표시**:
  - AI 처리 중일 때 캐릭터 우측 상단에 반짝이는 스파클 아이콘
  - Lucide-react의 `Sparkles` 컴포넌트 사용

### 4. 말풍선 입력 박스
**스타일**:
- 배경: 흰색 반투명 (bg-white/95) + backdrop-blur
- 테두리: 4px 주황색 (border-orange-300)
- 그림자: shadow-2xl
- 둥근 모서리: rounded-3xl

**말풍선 꼬리**:
- 요리사 캐릭터를 가리키는 삼각형 꼬리
- 위치: 박스 왼쪽 위 (-top-6 left-24)
- CSS border trick으로 구현

**내부 구성**:
1. 제목 텍스트: "무엇을 만들고 싶으세요?" (Fredoka 폰트)
2. 설명 텍스트: "재료를 입력하거나 사진을 올려주세요!"
3. 이미지 미리보기 영역 (업로드 시에만 표시)
4. 입력 영역:
   - 📷 카메라 버튼 (이미지 업로드)
   - 텍스트 입력창 (flex-1)
   - 🚀 전송 버튼 (로딩 중엔 스피너 표시)
5. 빠른 제안 태그 (4개)

**인터랙션**:
- Enter 키로 전송 가능
- 로딩 중엔 입력 비활성화
- 전송 버튼 호버 시 확대 효과 (scale-105)

### 5. 메시지 히스토리
**위치**: 입력 박스 위쪽, 스크롤 가능 영역

**사용자 메시지**:
- 배경: 흰색 반투명 (bg-white/90)
- 정렬: 오른쪽 (ml-auto)
- 이미지가 있으면 먼저 표시

**AI 메시지**:
- 배경: 주황색→빨간색 그라데이션 (from-orange-400/90 to-red-400/90)
- 정렬: 왼쪽 (mr-auto)
- 텍스트 색상: 흰색

**애니메이션**: 각 메시지 등장 시 `slideUp` 효과 (0.4s)

---

## 🎬 애니메이션 상세 명세

### 1. `float` - 떠다니는 음식 이모지
```css
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(5deg); }
}
```
- 지속시간: 5-10초 (랜덤)
- 딜레이: 0-3초 (랜덤)

### 2. `bounce-mouth` - 요리사 입 움직임
```css
@keyframes bounce-mouth {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.6); }
}
```
- 지속시간: 0.3초
- 조건: `isLoading === true`일 때만 적용

### 3. `chef-wave` - 요리사 모자 흔들기
```css
@keyframes chef-wave {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}
```
- 지속시간: 2초
- 조건: `isSpeaking === true`일 때 적용

### 4. `slideUp` - 메시지 등장
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```
- 지속시간: 0.4초

### 5. `pulse-glow` - 로딩 버튼 글로우
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255,140,90,0.3); }
  50% { box-shadow: 0 0 40px rgba(255,140,90,0.5); }
}
```
- 조건: `isLoading === true`일 때 전송 버튼에 적용

---

## 💻 기술 스택

### Frontend
- **프레임워크**: React 18+
- **언어**: JavaScript (또는 TypeScript)
- **스타일링**: Tailwind CSS 3.x
- **아이콘**: lucide-react
- **폰트**: Google Fonts (Fredoka, Outfit)

### API
- **AI 서비스**: Anthropic Claude API
- **모델**: claude-sonnet-4-20250514
- **인증**: API 키 (환경변수 관리 필수)

### 상태 관리
- React Hooks (useState, useEffect, useRef)
- 로컬 스토리지 (레시피 저장용)

---

## 🔐 보안 요구사항

### API 키 관리
**절대 금지**:
- 프론트엔드 코드에 API 키 하드코딩
- 클라이언트 사이드에서 직접 API 호출

**권장 방법**:
```
Option 1: 백엔드 프록시 서버
Client → Your Backend (Node.js/Express) → Claude API
         ↑ API 키 저장

Option 2: Serverless Functions
Client → Vercel/Netlify Function → Claude API
         ↑ 환경변수로 API 키 관리

Option 3: 개발 중에만 (테스트용)
- .env 파일에 저장
- .gitignore에 .env 추가
- REACT_APP_CLAUDE_API_KEY로 접근
```

### CORS 처리
- Claude API는 브라우저에서 직접 호출 불가능 (CORS 제한)
- 반드시 백엔드 또는 프록시를 통해 호출

---

## 📱 반응형 디자인

### 브레이크포인트
- **Desktop**: 1024px 이상 (사이드바 항상 표시)
- **Tablet**: 768px - 1023px (사이드바 토글 가능)
- **Mobile**: 767px 이하 (사이드바 오버레이)

### 모바일 최적화
- 입력 박스 패딩 축소
- 요리사 캐릭터 크기 조정
- 떠다니는 이모지 개수 감소 (4개)
- 사이드바는 햄버거 메뉴로 전환

---

## 🧪 테스트 시나리오

### 1. 기본 기능 테스트
- [ ] 텍스트 입력 후 레시피 생성 확인
- [ ] 이미지 업로드 후 재료 인식 확인
- [ ] 빠른 제안 태그 클릭 동작 확인
- [ ] Enter 키로 전송 가능 여부

### 2. UI/애니메이션 테스트
- [ ] 요리사 입 움직임 (로딩 중)
- [ ] 요리사 모자 흔들림 (응답 중)
- [ ] 메시지 슬라이드 업 애니메이션
- [ ] 떠다니는 음식 이모지
- [ ] 사이드바 토글 동작

### 3. 상태 관리 테스트
- [ ] 로그인/로그아웃 토글
- [ ] 레시피 저장 기능
- [ ] 저장된 레시피 개수 표시
- [ ] 이미지 미리보기 및 삭제

### 4. 에러 처리
- [ ] API 호출 실패 시 에러 메시지
- [ ] 빈 입력 방지 (텍스트 없고 이미지도 없을 때)
- [ ] 네트워크 오류 처리
- [ ] 로딩 타임아웃 처리

---

## 📁 프로젝트 구조 (권장)

```
recipe-chef-ai/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx           # 사이드바 컴포넌트
│   │   ├── ChefCharacter.jsx     # 요리사 캐릭터
│   │   ├── SpeechBubble.jsx      # 말풍선 입력 박스
│   │   ├── MessageHistory.jsx    # 대화 히스토리
│   │   └── RecipeCard.jsx        # 레시피 카드
│   ├── services/
│   │   └── claudeAPI.js          # API 호출 로직
│   ├── hooks/
│   │   └── useRecipeChat.js      # 채팅 상태 관리 훅
│   ├── utils/
│   │   ├── imageProcessor.js     # 이미지 변환
│   │   └── localStorage.js       # 저장소 관리
│   ├── styles/
│   │   ├── animations.css        # 커스텀 애니메이션
│   │   └── globals.css           # 전역 스타일
│   ├── App.jsx                   # 메인 앱
│   └── index.js
├── .env.example                  # 환경변수 샘플
├── .gitignore
├── package.json
└── tailwind.config.js
```

---

## 🚀 개발 단계별 가이드

### Phase 1: 기본 UI 구축 (1-2일)
1. React 프로젝트 세팅 + Tailwind 설정
2. 배경화면 + 떠다니는 이모지 구현
3. 사이드바 레이아웃
4. 말풍선 입력 박스 UI
5. 요리사 캐릭터 디자인

### Phase 2: 애니메이션 추가 (1일)
1. CSS 애니메이션 정의
2. 요리사 입/모자 움직임
3. 메시지 슬라이드 업
4. 호버 효과들

### Phase 3: Claude API 연동 (2-3일)
1. 백엔드/프록시 서버 구축
2. API 호출 로직 작성
3. 텍스트 입력 → 레시피 생성
4. 이미지 업로드 → base64 변환 → 재료 인식
5. 응답 파싱 및 표시

### Phase 4: 상태 관리 & 저장 (1-2일)
1. 메시지 히스토리 관리
2. 로컬 스토리지 연동
3. 레시피 북마크 기능
4. 로그인 상태 관리 (UI만, 실제 인증은 나중에)

### Phase 5: 폴리싱 & 테스트 (1-2일)
1. 반응형 디자인 적용
2. 에러 처리 강화
3. 로딩 상태 개선
4. 크로스 브라우저 테스트
5. 성능 최적화

**예상 총 개발 기간**: 6-10일

---

## 📌 추가 개선 아이디어 (Optional)

### 고급 기능
- [ ] 음성 입력 (Web Speech API)
- [ ] 레시피 공유 기능 (URL 생성)
- [ ] 인분 조절 슬라이더 (재료 양 자동 계산)
- [ ] 조리 타이머 기능
- [ ] 영양 정보 표시
- [ ] 다국어 지원

### 게이미피케이션
- [ ] 레시피 도전 과제
- [ ] 요리 뱃지 시스템
- [ ] 재료 조합 추천 점수

### 소셜 기능
- [ ] 사용자 간 레시피 공유
- [ ] 레시피 평점/리뷰
- [ ] 커뮤니티 피드

---

## 🎓 참고 자료

### Claude API 문서
- https://docs.anthropic.com/claude/reference/messages_post
- https://docs.anthropic.com/claude/docs/vision

### 디자인 영감
- Dribbble: 음식 앱 디자인
- Behance: 요리 인터페이스

### 유사 서비스
- Supercook.com (재료 기반 레시피)
- MyFridgeFood.com
- Tasty 앱 (BuzzFeed)

---

## ✅ 완료 체크리스트

개발 완료 전 반드시 확인:
- [ ] 모든 애니메이션이 부드럽게 작동
- [ ] API 키가 안전하게 관리됨
- [ ] 텍스트/이미지 입력 모두 정상 작동
- [ ] 요리사 캐릭터 모션이 AI 상태와 동기화
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] 에러 상황 처리
- [ ] 레시피 저장/불러오기 동작
- [ ] 크로스 브라우저 호환성
- [ ] 성능 최적화 (이미지 압축, 코드 스플리팅)
- [ ] 접근성 기본 준수 (키보드 네비게이션, alt 텍스트)

---

## 📧 문의사항

프롬프트 관련 질문이나 기술적 이슈가 있으면 언제든 문의하세요!

**프로젝트 목표**: 사용자에게 즐겁고 유용한 요리 경험을 제공하는 AI 레시피 추천 서비스

**핵심 가치**: 직관적인 UI, 귀여운 캐릭터 인터랙션, 실용적인 레시피 추천

Happy Coding! 🍳👨‍🍳✨