<p align = "center"><img src = "https://github.com/42-world/42world-Frontend/blob/main/public/assets/characterLogo.png?raw=true" width = "400"></p>

# 42WORLD
## 소개
42서울 재학생과 졸업생이 교류하는 온라인 커뮤니티 제작 프로젝트입니다.

이 저장소에는 **백엔드 소스코드**가 저장되어 있고, 프론트엔드 소스코드는 [이곳](https://github.com/42-world/42world-Frontend)에서 볼 수 있습니다.

## 커뮤니티 둘러보기
https://www.42world.kr/

## 저장소 구조

```
├── config
│    └── .env.dev
├── src
│    ├── article
│    ├── auth
│    ├── best
│    ├── category
│    ├── comment
│    ├── config
│    ├── database
│    ├── filters
│    ├── ft-auth
│    ├── notification
│    ├── reaction
│    └── user
└── test
```

## 기술스택
- Frontend: [React.js](https://reactjs.org/)
- Backend
  - [Nest.js](https://nestjs.com/)
  - [TypeORM](https://typeorm.io/#/)
  - [Redis](https://redis.io/)
  - [Docker](https://www.docker.com/)

# 프로젝트
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

## env 파일 형식
sample.env.dev 파일을 .env.dev 로 이름을 바꾸고 비어있는 부분을 채워주세요.


## 실행하기
- docker-compose_backup.yml을 docker-compose.yml로 바꿔주세요
  - 현재 docker-compose.yml은 배포하기 위한 세팅을 하느라 실험중인 상태입니다.
  - docker-compose.yml은 추후 하나로 합쳐지거나 사라질 예정입니다.

- 아래 명령어를 입력하여 실행해주세요.
    ```
    make dev
    yarn start:dev
    ```
    - 명령어는 디렉토리 최상단에서 실행해주세요.

## 테스트 실행하기
현재 e2e 테스트의 일부만 제대로 구성되어 있습니다.

다른 테스트 및 유닛테스트는 추후 보강 예정입니다.

```
./run_test_db.sh

yarn test:e2e ./test/app.e2e-spec.ts
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

|[🍑 echung](https://github.com/euiminnn)| [🍇 ycha](https://github.com/Skyrich2000)| [🥑 klim](https://github.com/PIut0)| [🥝 hyeonkim](https://github.com/hyongti)| [🍋 suhshin](https://github.com/rkskekzzz)| [🍍 sham](https://github.com/GulSam00)| [🍹 sooyoon](https://github.com/blingblin-g)| [🍒 chlim](https://github.com/rockpell) 
|---|---|---|---|---|---|---|---|

## 개발노트
[이곳](https://euimin.notion.site/42WORLD-925997bb2e7245b48fca5afeb298db76)에 개발과정을 상세히 기록해 두었습니다 :)

질문이 생기면 이메일(42world.official@gmail.com)로 언제든 연락주세요.

저장소에 별 달아주시는거 잊지마세요 ✨✨✨
