<p align = "center"><img src = "https://github.com/42-world/42world-Frontend/blob/main/public/assets/characterLogo.png?raw=true" width = "400"></p>

# 42WORLD

![issue](https://img.shields.io/github/issues/42-world/42world-Backend)
![issue](https://img.shields.io/github/issues-closed/42-world/42world-Backend)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/42-world/42world-Backend)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/b3a77efc4f694b14953bd35e3ee7327f)](https://www.codacy.com/gh/42-world/42world-Backend/dashboard?utm_source=github.com&utm_medium=referral&utm_content=42-world/42world-Backend&utm_campaign=Badge_Grade)

## 소개

42서울 재학생과 졸업생이 교류하는 온라인 커뮤니티 제작 프로젝트입니다.

## 커뮤니티 둘러보기

https://www.42world.kr/

## 저장소 구조

```
│── apps
│   ├── api
│   │   ├── src
│   │   └── test
│   └── admin
│       ├── src
│       └── test
│── infra
└── libs
    ├── common
    └── entity

```

## 기술스택

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

먼저 위에 명시된 버전들을 확인해주세요.

저장소를 clone 하고 패키지를 설치해주세요.

```
git clone https://github.com/42-world/42world-Backend.git

yarn install
```

## env 설정하기

먼저 direnv를 설치해주세요

```
brew install direnv
```

설치가 완료되었다면 [여기](https://direnv.net/docs/hook.html)를 보고 hook을 설정해주세요

.envrc.sample을 보고 .envrc 환경설정 파일을 구성해주세요

구성에 어려움이 있다면 Issue를 남겨주세요

## 실행하기

.envrc 설정을 마쳤다면 아래 명령어로 실행할 수 있습니다.

```
yarn set-infra # 필요한 인프라를 docker-compose로 실행합니다.

yarn start # api 서버를 실행합니다.
```

실행후에는 아래 명령어를 통해 관련 인프라를 회수할 수 있습니다.

```
yarn clear-infra # 필요한 인프라를 docker-compose로 종료합니다.
```

## 테스트

아래 명령어로 테스트할 수 있습니다.

```
yarn test-set-infra # 테스트에 필요한 인프라를 실행합니다.

yarn test # 테스트를 실행합니다.

yarn test:e2e # e2e 테스트를 실행합니다.
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
5. Pull Request를 열어 develop 브랜치에 머지해주세요.

- your-branch-name -> develop

## 3. 이메일 보내기

- 위 두가지 방법으로 설명할 수 없는 문제라면 이메일로 연락주세요.
- 42world.official@gmail.com

# 개발 이야기

## 기여한 사람들

| [🍑 echung](https://github.com/euiminnn) | [🍇 ycha](https://github.com/Skyrich2000) | [🍹 sooyoon](https://github.com/blingblin-g) | [🍒 chlim](https://github.com/rockpell) | [🍏 sikang](https://github.com/Yaminyam) | [👻 seongpar](https://github.com/mimseong) | [🍌 juchoi](https://github.com/raejun92) |
| ---------------------------------------- | ----------------------------------------- | -------------------------------------------- | --------------------------------------- | ---------------------------------------- | ------------------------------------------ | ---------------------------------------- |

## 개발노트

[이곳](https://euimin.notion.site/euimin/42WORLD-2fb0a5cb337c400d986626292f4830d4)에 개발과정을 상세히 기록해 두었습니다 :)

질문이 생기면 이메일(42world.official@gmail.com)로 언제든 연락주세요.

저장소에 별 달아주시는거 잊지마세요 ✨✨✨
