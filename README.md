# 슈퍼차일드 — 북극에서 온 답장

2026년 크리스마스 행사 안내 페이지입니다. 신청은 외부 Google 설문에서 받습니다.
HTML·CSS·JavaScript로 구성되어 있으며 별도 서버 프로그램이나 데이터베이스를 사용하지 않습니다.

## GitHub Pages에 공개하기

1. GitHub에서 `santa-notice` 등의 이름으로 새 저장소를 만듭니다. GitHub Free에서 Pages를 쓰려면 공개 저장소가 필요합니다.
2. 이 폴더의 **내용물**을 저장소의 `main` 브랜치에 올립니다. 저장소 첫 화면에 `index.html`, `assets`, `scripts`, `.github`가 보여야 합니다. ZIP 파일 자체를 올리지 마세요.
3. 저장소 **Settings → Pages → Build and deployment → Source → GitHub Actions**를 선택합니다.
4. **Actions → Publish event page → Run workflow → main**으로 첫 배포를 실행합니다. 설정 전에 실행된 작업이 실패했다면 설정 후 다시 실행하면 됩니다.
5. 작업이 성공하면 **Settings → Pages**에 표시된 공개 주소를 사용합니다.

이후 `main` 브랜치의 파일을 수정하면 자동으로 다시 배포됩니다.
배포 과정에서 실제 사이트 주소를 읽어 공유 이미지 주소와 페이지 대표 주소를 자동 설정합니다.
사용자명·저장소명·사용자 지정 도메인이 바뀌어도 주소를 코드에 직접 적을 필요가 없습니다.

공식 안내:
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

GitHub Pages에는 온라인 사업·전자상거래 등에 관한 이용 제한이 있습니다. 이 페이지는 재원생 무료 행사 안내이며 결제를 처리하지 않습니다. 용도가 판매·결제 서비스로 바뀌면 호스팅 이용 조건을 다시 확인하세요.

## 수정 위치

- 본문, 일정, 전화번호: `index.html`
- 신청서 주소: `index.html` 안의 `id="applyBtn"`와 `id="barBtn"` 링크 두 곳
- 색상·글꼴·배치: `assets/style.css`
- 애니메이션·하단 고정 신청 버튼 표시: `assets/main.js`
- 카카오톡 등 공유용 제목·설명: `index.html`의 `og:` 메타 태그
- 공유용 이미지: `assets/og-image.png` (1200 × 630)
- 탭 아이콘: `assets/favicon.svg`

신청 링크와 안내 본문은 JavaScript 없이도 작동합니다.
Google Fonts가 연결되지 않으면 기기의 기본 글꼴로 표시됩니다.

## 미리보기와 다른 호스팅

`index.html`을 브라우저로 열어 미리 볼 수 있습니다.
다른 정적 호스팅으로 배포할 때는 실제 공개 주소를 넣어 아래 명령을 실행하고, 생성된 `_site` 폴더를 업로드합니다.

```bash
python3 scripts/build.py --base-url https://example.com/event/
```

위 주소는 예시입니다. 실제 공개 주소와 하위 경로로 바꾸세요. Python 기본 라이브러리만 사용하므로 추가 패키지는 필요하지 않습니다.

공유 전에는 휴대폰에서 페이지와 신청서를 열어 보고, 설문 응답 권한과 사진 첨부를 확인하세요.
설문 설정이나 응답 데이터는 이 저장소에 포함되지 않습니다.
