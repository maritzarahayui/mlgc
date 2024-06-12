FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000
ENV MODEL_URL=https://storage.googleapis.com/submissionmlgc-maritza/submissions-model/model.json
CMD ["npm", "start"]
EXPOSE 3000