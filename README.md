# STYLEGACY

`Style`과 `Legacy`의 합성어로, 패션과 스타일 분야에서 다양한 브랜드들을 유산처럼 보존하고, 사용자들에게 지도정보와 함께 실시간으로 전해주는 플랫폼입니다. 사용자들이 언제나 브랜드에 대한 최신 정보를 얻을 수 있도록 합니다.

## 주요 기능과 특징

- `react-toolkit, react-query, firebase를 이용한 웹앱 구현`

- `디자이너 브랜드 및 편집샵 위치 정보 제공`

  지도를 활용하여 사용자들에게 주변에 위치한 다양한 디자이너 브랜드와 편집샵을 보여줍니다. 실시간으로 지도 정보를 업데이트하여 사용자들이 쉽고 편리하게 원하는 스타일을 찾을 수 있습니다.

- `브랜드 리뷰`

  사용자들이 실시간으로 리뷰와 평가를 함께 남길 수 있어서 다른 사용자들에게 신뢰성 있는 정보를 얻을 수 있도록 돕습니다.

## install

```javascript
 yarn install
 # 또는
 yarn i
```

## 팀구성

윤수민 | 김슬기 | 안홍민 | 전동헌 | 박희연

## 기술스택

  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white"/>
	<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=HTML5&logoColor=white" />
	<img src="https://img.shields.io/badge/Styledcomponents-DB7093?style=flat&logo=Styledcomponents&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=Firebase&logoColor=white" />

## 커밋 컨벤션

- Feat : 새로운 기능 추가
- Fix : 버그 수정
- Docs : 문서 변경
- Style : styled-components 수정 등 스타일 관련 변경, 코드 formatting, 코드 자체의 변경이 없는 경우
- Chore : 설정 변경 등 기타 변경사항
- Refactor : 코드 리팩토링 (변수명 변경 등)
- Comment : 주석 추가 및 변경

## 코드 컨벤션

### 폴더, 파일명

컴포넌트 파일명은 `파스칼 케이스(PascalCase)`를 사용한다.

```javascript
MainHome.jsx;
```

컴포넌트를 제외한 폴더, 파일명은 `카멜 케이스(camelCase)`를 사용한다.

```javascript
kakaoMap.js;
```

### 함수

함수명은 `카멜 케이스(camelCase)`를 원칙으로 한다.

```javascript
const addPost = () => {};
```

### 클래스명

클래스명은 케밥 케이스(kebab-case)를 원칙으로 한다.

```javascript
<h1 className="main-title">제목</h1>
```

---

### 스타일 코드 순서

스타일 코드의 순서는 아래와 같이 작성한다.

```javascript
.sample {
  /* position 관련 */
  position: absolute;
  top: 0;
  left: 0;

  /* display 관련 */
  display: flex;
  justify-content: center;
  align-items: center;

  /* size 관련 */
  width: auto;
  height: auto;

  /* margin, padding */
  margin: 0 auto;
  padding: 12px;

  /* background 관련 */
  background-color: #ffffff;

  /* border 관련 */
  border: 1px solid #ffffff;
  border-radius: 12px;

  /* font 관련 */
  font-size: 24px;
  font-weight: 700;
  text-align: center;

  /* animation 관련 */
  transform: translate(10px, 100%);
  transition: 300ms;
}
```

## 구현 기능

1. 메인페이지

   ![image](https://github.com/suminute/Stylegacy/assets/92218638/dae2f489-036e-4897-8ee0-9e1a55834493)

2. 로그인 / 회원가입

- 로그인
  ![image](https://github.com/suminute/Stylegacy/assets/92218638/db76ac92-5ca3-4a8b-839e-319a4281ab3f)
- 회원가입
  ![image](https://github.com/suminute/Stylegacy/assets/92218638/e4dfbcde-0969-48b5-9f4b-705555a3fa10)

3. 검색 페이지

4. 게시물 상세페이지
