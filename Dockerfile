FROM registry.thinknet.co.th/sredev/nodejs:boron

COPY . /usr/src/app/

RUN cp .env.devsite.example .env \
    && yarn install
    # && chmod -R 777 usr/src/app/logs \



CMD ["node","server.js"]