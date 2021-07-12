FROM --platform=arm64 base as build

COPY --slim ./package.json ./
RUN npm install

COPY ./package.json ./

COPY ./build.sh ./

RUN ./build.sh
