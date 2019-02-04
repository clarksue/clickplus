#!/bin/bash

filepath=`echo $0`
dirpath=`dirname $filepath`
echo $dirpath
cd $dirpath


echo "`date` - build begin" >> build.log
echo "`date` - git pull" >> build.log
git pull >> build.log 2>&1
echo "`date` - rm -rf node_modules" >> build.log
rm -rf node_modules >> build.log 2>&1
echo "`date` - npm run cleanup && npm run webpack:prod:main && npm run clean-www" >> build.log
npm run cleanup && npm run webpack:prod:main && npm run clean-www >> build.log 2>&1
echo "`date` - ./gradlew -Pprod bootWar" >> build.log
./gradlew -Pprod bootWar >> build.log 2>&1

echo "`date` - sh stop.sh" >> build.log
sh stop.sh
sleep 3

echo "`date` - sh start.sh" >> build.log
sh start.sh
