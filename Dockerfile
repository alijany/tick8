FROM node:16
# Create app directory
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN corepack enable
RUN yarn install
RUN yarn global add parcel esbuild

# Bundle app source
COPY . .

RUN parcel build front/index.html
RUN esbuild server.ts --bundle --platform=node --minify --outfile=./dist/server.js

# use the EXPOSE instruction to port maping
EXPOSE 80

CMD [ "node", "dist/server.js" ]