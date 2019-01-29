echo "`date` - build begin" >> build.log
echo "`date` - git pull" >> build.log
git pull >> build.log 2>&1
echo "`date` - rm -rf node_modules" >> build.log
rm -rf node_modules >> build.log 2>&1
echo "`date` - npm run cleanup && npm run webpack:prod:main && npm run clean-www" >> build.log
npm run cleanup && npm run webpack:prod:main && npm run clean-www >> build.log 2>&1
echo "`date` - ./gradlew -Pprod bootWar" >> build.log
./gradlew -Pprod bootWar >> build.log 2>&1

echo "`date` - skill" >> build.log
ps -ef |grep -P "clickplus" | grep war | grep -v grep | grep -v vi | awk -F " " '{print $2}' | xargs -i kill {}
sleep 3

echo "`date` - java -jar ./build/libs/clickplus-0.0.1-SNAPSHOT.war" >> build.log
nohup java -jar ./build/libs/clickplus-0.0.1-SNAPSHOT.war 2>&1 &
