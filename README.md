<p align = "center"><img src = "https://github.com/42-world/42world-Frontend/blob/main/public/assets/characterLogo.png?raw=true" width = "400"></p>

# 42WORLD

![issue](https://img.shields.io/github/issues/42-world/42world-Backend)
![issue](https://img.shields.io/github/issues-closed/42-world/42world-Backend)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/42-world/42world-Backend)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/b3a77efc4f694b14953bd35e3ee7327f)](https://www.codacy.com/gh/42-world/42world-Backend/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=42-world/42world-Backend&amp;utm_campaign=Badge_Grade)

## 소개

42서울 재학생과 졸업생이 교류하는 온라인 커뮤니티 제작 프로젝트입니다.

이 저장소에는 **백엔드 소스코드**가 저장되어 있고, 프론트엔드 소스코드는 [이곳](https://github.com/42-world/42world-Frontend)에서 볼 수 있습니다.

## 커뮤니티 둘러보기

https://www.42world.kr/

## 저장소 구조

```
│── apps
│   ├── api
│   │   ├── src
│   │   ├── test
│   │   └── views
│   └── scheduler
│       ├── src
│       └── test
│── infra
│   └── config
├── libs
│   ├── common
│   ├── entity
│   └── utils
└── logs
```

## 기술스택

- Frontend: [React.js](https://reactjs.org/)
- Backend
  - [Nest.js](https://nestjs.com/)
  - [TypeORM](https://typeorm.io/#/)
  - [Redis](https://redis.io/)
  - [Docker](https://www.docker.com/)

# 프로젝트

## 버전

- node>=16.13.0
- yarn>=1.22.10
- docker-compose>=1.29.2
- docker>=20.10.11

## 설치하기

1. 위에 명시된 버전들을 확인해주세요.
2. 백엔드 저장소를 클론해주세요.
   ```
   git clone https://github.com/42-world/42world-Backend.git
   ```
3. yarn으로 패키지를 설치해주세요.
   ```
   yarn install
   ```

## env 파일 형식

sample.env.dev 파일을 .env.dev 로 이름을 바꾸고 비어있는 부분을 채워주세요.

`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL` 은 github oauth 로그인 관련 설정입니다.

이 링크를 참조하여 생성한 한 후 채워주세요 [github building-oauth-apps](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)

`EMAIL_*`은 이메일 인증과 관련된 설정입니다.

완벽히 같지는 않지만 이 링크를 참조하여 원하는 설정을 채워주세요 [node-mailer](https://nodemailer.com/about/)

## 실행하기

아래 명령어를 입력하여 실행해주세요.
  ```
  make dev
  ```
명령어는 디렉토리 최상단에서 실행해주세요.

## 테스트 실행하기

현재 e2e 테스트의 일부만 제대로 구성되어 있습니다.

다른 테스트 및 유닛테스트는 추후 보강 예정입니다.

아래 명령어를 입력하여 테스트를 실행해주세요.
  ```
  make test
  ```
명령어는 디렉토리 최상단에서 실행해주세요.

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
5. Pull Request를 열어 develop 브랜치에 머지해주세요.

- your-branch-name -> develop

## 3. 이메일 보내기

- 위 두가지 방법으로 설명할 수 없는 문제라면 이메일로 연락주세요.
- 42world.official@gmail.com

# 개발 이야기

## 기여한 사람들

| [🍑 echung](https://github.com/euiminnn) | [🍇 ycha](https://github.com/Skyrich2000) | [🍹 sooyoon](https://github.com/blingblin-g) | [🍒 chlim](https://github.com/rockpell) | [🍏 sikang](https://github.com/Yaminyam) | [👻 seongpar](https://github.com/mimseong) | [🍌 juchoi](https://github.com/raejun92)
| ---------------------------------------- | ----------------------------------------- | ----------------------------------- | ----------------------------------------- | ------------------------------------------ | -------------------------------------- | -------------------------------------------- |

## 개발노트

[이곳](https://euimin.notion.site/euimin/42WORLD-2fb0a5cb337c400d986626292f4830d4)에 개발과정을 상세히 기록해 두었습니다 :)

질문이 생기면 이메일(42world.official@gmail.com)로 언제든 연락주세요.

저장소에 별 달아주시는거 잊지마세요 ✨✨✨
