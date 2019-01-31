
ps -ef |grep -P "clickplus" | grep war | grep -v grep | grep -v vi | awk -F " " '{print $2}' | xargs -i kill {}
