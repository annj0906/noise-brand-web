# NOISE 안정화 — 2026-10-30

기준: annj0906/noise-brand-web, commit 2b90119.
수정 전 전체 파일: noise-before-stabilization-20261030.zip.
원격 저장소에는 푸시하지 않았습니다.

## 확인한 원인

- 눈송이 handoff가 track.top > viewport.height * .8 조건으로 조기 종료되었습니다. 이동 계산의 종료 위치와 달라서 정면 카드에 도착하기 전에 bridge와 흰 배경이 사라질 수 있었습니다.
- 전환용 흰 배경에 의존해 이전 frequency-white 레이어가 다시 드러날 수 있었습니다.
- 캐러셀 intro:rise 및 독립 autoplay가 handoff와 별도로 실행되었습니다.
- 캐러셀 aspectRatio:1, 정사각형 캔버스, FlipCard radius:22와 그림자 설정이 기존 외형과 달랐습니다.
- 실제 저장소는 정적 사이트와 React Bits 번들입니다. React 프로젝트 소스/package.json은 없으며, 번들 내부 라이브러리 대신 끝부분의 사이트 연결 설정만 수정했습니다.

## 변경

- track.top=0을 이동 종료 기준으로 통일하고 data-ready 상태의 실제 첫 카드 tile 경계를 목적지로 사용합니다.
- 흰 collection 배경과 stacking 순서를 유지하고 track의 overflow:clip을 해제했습니다.
- 캐러셀 등장 효과를 끄고 안착 후 600ms 대기한 다음 autoplay를 허용합니다. 상세창이 열리면 기존 방식으로 회전을 중지합니다.
- 카드 폭 220, 기존 325:431 비율, radius 0, 중앙 이미지 정렬을 적용했습니다. 상세 카드 폭 상한 300은 유지했습니다.
- glare/그림자/상세창 배경 블러를 제거했습니다.
- smooth-scroll.js는 실제 window scroll 위치를 100ms 시정수로 보간합니다. 기존 BLACK/WHITE wheel handler가 처리한 이벤트는 양보하며, 상세창·내부 스크롤·터치·동작 줄이기 설정은 별도로 처리합니다. 섹션마다 별도 가상 스크롤 진행도를 추가하지 않았습니다.

## 검증

- script.js, flip-card.js, smooth-scroll.js: node --check 통과.
- git diff --check 통과.
- 데스크톱 브라우저: 기존 조기 종료 지점을 지나도 눈송이 유지. 안착 직전 bridge/tile 경계 오차 0.2px 미만.
- 자동 회전, 역방향 스크롤 후 다시 전진, 카드 선택, 상세창 열기, 클릭으로 향 설명 뒤집기, 닫기 확인.
- FlipCard aria-pressed=true 및 radius=0px 확인.
- 390x844 모바일: 캐러셀 표시, 가로 페이지 넘침 없음, 세로 카드 비율 유지.
- 확인한 브라우저 콘솔에 error 없음.

## 범위와 남은 확인

- 모바일은 원래 구현과 동일하게 긴 눈송이 handoff 없이 캐러셀을 표시합니다.
- 동작 줄이기 설정의 실제 OS 전환, 실제 터치 기기의 제스처, 모든 브라우저/화면 크기를 검증한 것은 아닙니다.
- 전체 페이지의 휠 보간은 추가했지만 모든 섹션의 기존 애니메이션 로직을 재작성하지 않았습니다.
- 로컬 미리보기: node local-preview.cjs → http://127.0.0.1:4173.
