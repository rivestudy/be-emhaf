# Gunakan Node.js LTS
FROM node:22

# Buat working dir di container
WORKDIR /usr/src/app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy seluruh source code
COPY . .

# Expose port API
EXPOSE 3000

# Jalankan server
CMD ["npm", "start"]
