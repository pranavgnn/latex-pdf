FROM oven/bun:alpine

RUN apk add --no-cache curl && \
    curl -L https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz | tar -xz && \
    mv tectonic /usr/local/bin/tectonic && \
    chmod +x /usr/local/bin/tectonic && \
    apk del curl

WORKDIR /app

COPY package.json tsconfig.json ./

RUN bun install --frozen-lockfile

COPY src/ src/
COPY assets/ assets/

EXPOSE 3000

CMD ["bun", "src/index.ts"]