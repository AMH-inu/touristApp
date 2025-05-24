# 베이스 이미지
FROM node:18

# 컨테이너 내 작업 디렉토리 지정
WORKDIR /app

# package.json과 lock 파일 복사
COPY frontend/package*.json ./

# 의존성 설치
RUN npm ci

# 나머지 소스 복사
COPY frontend/ ./

# 빌드
RUN npm run build

# nginx로 정적 파일 및 제공
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY proxy/nginx.conf /etc/nginx/conf.d/nginx.conf

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]