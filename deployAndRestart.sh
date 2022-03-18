#!/bin/bash

GREEN='\033[0;32m'
NC='\033[0m'
echo "${GREEN}============ Starting deployment ============${NC}"

START=`date +%s`

  echo '➜ git pull';
   git pull https://hocvv1199:Vuvanhoc286011@bitbucket.org/twendee/salesbox_react.git salesbox_vtt;
   yarn;
   yarn post-install;
  yarn build;
  pm2 stop 0;
  pm2 start 0;
  echo '➜ Build done';

END=`date +%s`
RUNTIME=$((end - start))
echo "\n${GREEN}✔ 🎉 Done.${NC}\n"
