FROM base as build

COPY --slim ./package.json ./
RUN npm i --no-ci

COPY ./package.json ./
RUN npm run build
