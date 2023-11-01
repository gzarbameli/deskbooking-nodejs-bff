# Usa un'immagine Node.js come base
FROM node:16

# Crea una directory di lavoro nel container
WORKDIR /

# Copia i file del tuo progetto nel container
COPY package*.json ./
COPY server.js ./

# Installa le dipendenze del progetto
RUN npm install

# Esponi la porta su cui il server Fastify ascolterà
EXPOSE 3002

# Comando per avviare il server Fastify
CMD ["node", "--require", "./instrumentation.js", "server.js"]
