FROM mhart/alpine-node:latest
RUN sudo apt-get install git-all
ENV NODE_ENV production

RUN npm i -g forever

#RUN npm install pm2 -g --production
#RUN npm install -g strong-supervisor --production
# RUN npm install forever -g --production
# Create app directory
# RUN mkdir -p /usr/app
WORKDIR /usr/app

# Install app dependencies
# COPY ../package.json /usr/app/

# Copy server
#COPY server.js /usr/src/app/

EXPOSE 8080

# Copy start.sh
# COPY start.sh /usr/app/

# VOLUME ["/usr/app"]

# CMD ["docker/start.sh"]

CMD sh docker/start.sh
