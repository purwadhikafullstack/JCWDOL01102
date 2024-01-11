FROM node:18-alpine AS build-stage
WORKDIR /app
COPY package-lock.json ./
COPY package.json ./
RUN npm ci
COPY . .
RUN npm run build

# Final stage
FROM node:18-alpine AS final-stage
WORKDIR /app

# Install bash and serve
RUN apk update \
    && apk add bash \
    && yarn global add serve

# Copy the built files from the build-stage
COPY --from=build-stage /app .

# Copy the start script
COPY ./start.sh ./
RUN chmod +x ./start.sh

# Start the application using the start script
CMD ["./start.sh"]

# CMD [ "tail", "-f", "/dev/null" ]