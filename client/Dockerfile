FROM node:12

ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000

WORKDIR /webapp
ADD . /webapp/

RUN apt-get update
RUN apt-get install -y --no-install-recommends apt-utils dialog curl apt-transport-https lsb-release git bash-completion iproute2 procps sudo
RUN curl -sS https://dl.yarnpkg.com/$(lsb_release -is | tr '[:upper:]' '[:lower:]')/pubkey.gpg | apt-key add - 2>/dev/null
RUN echo "deb https://dl.yarnpkg.com/$(lsb_release -is | tr '[:upper:]' '[:lower:]')/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update

RUN npm i -g npm && curl --compressed -o- -L https://yarnpkg.com/install.sh | bash

RUN yarn
RUN yarn run build

EXPOSE ${NUXT_PORT}

CMD ["yarn", "start"]
