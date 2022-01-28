<p align = "center"><img src = "https://github.com/42-world/42world-Frontend/blob/dev/public/assets/characterLogo.png?raw=true" width = "400"></p>

# 42WORLD
## 소개
42서울 재학생과 졸업생이 교류하는 온라인 커뮤니티 제작 프로젝트입니다.

## 커뮤니티 둘러보기
https://www.42world.kr/

## 저장소 구조

```
├── src
│    ├── Components
│    ├── Entities
│    ├── Network
│    ├── Pages
│    ├── Styled
│    └── Utils
└── public
     ├── assets
     └── index.html
```

## 기술스택
- [React.js](https://reactjs.org/)
- [Nest.js](https://nestjs.com/)


# 프론트엔드
## 설치하기
0. npm 버전을 확인해주세요.
    ```
    npm -v
    ```
    - 명령어를 입력했을 때 **8.1.4** 미만이면 아래 명령어를 통해 버전 업그레이드를 진행해주세요.
        ```
        npm install npm@8.1.4 -g
        ```
1. 프론트엔드 저장소를 클론해주세요.
    ```
    git clone https://github.com/42-world/42world-Frontend.git
    ```
2. npm으로 패키지를 설치해주세요.
    ```
    npm install
    ```
    - 명령어는 디렉토리 최상단에서 실행해주세요.

## 실행하기
- 아래 명령어를 입력하여 실행해주세요.
    ```
    npm run start
    ```
    - 명령어는 디렉토리 최상단에서 실행해주세요.

# 백엔드
**! Docker 가 설치되어 있어야 합니다.**
## 설치하기
0. yarn 버전을 확인해주세요.
    ```
    yarn -v
    ```
    - 명령어를 입력했을 때 **1.22.10** 미만이면 아래 명령어를 통해 버전 업그레이드를 진행해주세요.
        ```
        yarn set version 1.22.10
        ```
1. 백엔드 저장소를 클론해주세요.
    ```
    git clone https://github.com/42-world/42world-Backend.git
    ```
2. yarn으로 패키지를 설치해주세요.
    ```
    yarn install
    ```

## 실행하기
- 아래 명령어를 입력하여 실행해주세요.
    ```
    make dev
    ```

# 기여하기
42world 커뮤니티 제작은 오픈소스로 진행되고 있습니다.

아래의 방법으로 누구나 이 프로젝트에 기여할 수 있습니다.

## 1. Issue 달기
- 간단한 버그 혹은 제안은 이슈 탭을 이용해주세요.
    - [프론트엔드 이슈](https://github.com/42-world/42world-Frontend/issues)
    - [백엔드 이슈](https://github.com/42-world/42world-Backend/issues)
- 설명과 함께 "enhancement" 태그를 달아주시면 확인 후 빠르게 수정하겠습니다.

## 2. Pull Request 보내기
1. 해당 저장소를 포크 후 클론하세요.
2. Feature 브랜치를 생성하세요. (`git checkout -b feature/your-branch-name`)
3. 수정사항을 커밋해주세요.
4. 리모트 저장소에 푸시하세요. (`git push origin feature/your-branch-name`)
5. Pull Request를 열어 dev 브랜치에 머지해주세요.
- your-branch-name -> dev

## 3. 이메일 보내기
- 위 두가지 방법으로 설명할 수 없는 문제라면 이메일로 연락주세요.
- 42world.official@gmail.com

# 개발 이야기
## 기여한 사람들

<!-- <a href="https://github.com/42-world/42world-Frontend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=42-world/42world-Frontend" />
</a> -->


|[🍑 echung](https://github.com/euiminnn)| [🍇 ycha](https://github.com/Skyrich2000)| [🥑 klim](https://github.com/PIut0)| [🥝 hyeonkim](https://github.com/hyongti)| [🍋 suhshin](https://github.com/rkskekzzz)| [🍍 sham](https://github.com/GulSam00)| [🍹 sooyoon](https://github.com/blingblin-g)| [🍒 chlim](https://github.com/rockpell) 
|---|---|---|---|---|---|---|---|

## 개발노트
[이곳](https://euimin.notion.site/42WORLD-925997bb2e7245b48fca5afeb298db76)에 개발과정을 상세히 기록해 두었습니다 :)

질문이 생기면 이메일(42world.official@gmail.com)로 언제든 연락주세요.

저장소에 별 달아주시는거 잊지마세요 ✨✨✨