# Copyright (C) 2020  Atos Spain SA. All rights reserved.
# 
# This file is part of the FAIR4Health GUI.
# 
# This file is free software: you can redistribute it and/or modify it under the 
# terms of the Apache License, Version 2.0 (the License);
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# The software is provided "AS IS", without any warranty of any kind, express or implied,
# including but not limited to the warranties of merchantability, fitness for a particular
# purpose and noninfringement, in no event shall the authors or copyright holders be 
# liable for any claim, damages or other liability, whether in action of contract, tort or
# otherwise, arising from, out of or in connection with the software or the use or other
# dealings in the software.
# 
# See README file for the full disclaimer information and LICENSE file for full license 
# information in the project root.

### STAGE 1: Build with node alpine ###
FROM node:12.13-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
# RUN npm install --production
RUN npm install
COPY . .
# RUN npm run build:production
# RUN npm run build
CMD npm run start:mock:server

### STAGE 2: Run with engine the dist ###
# FROM nginx:1.17.1-alpine
# COPY --from=build /usr/src/app/dist/f4h-portal /usr/share/nginx/html