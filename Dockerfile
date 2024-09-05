# Använd en officiell Node.js-avbildning som bas
FROM node:16

# Ange arbetskatalogen i containern
WORKDIR /app

# Kopiera package.json och package-lock.json till arbetskatalogen
COPY package*.json ./

# Installera applikationens beroenden
RUN npm install

# Kopiera resten av applikationens filer
COPY . .

# Exponera porten som applikationen körs på
EXPOSE 8080

# Starta applikationen med npm start
CMD ["npm", "start"]
