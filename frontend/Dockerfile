FROM node:16.3.0-alpine AS development

ENV NODE_ENV development

WORKDIR /react-app/

# Installing dependencies
COPY ./package*.json /react-app/
RUN npm install --verbose

COPY . .

RUN npm run build

EXPOSE 80

ENV PORT=80

CMD ["npm","start"]
