#/bin/bash
  JS_FILES=$(find src ! -name "*test.js" -type f)
  for FILE in $JS_FILES; do
      short_name=`basename $FILE`
      filename="${short_name%.*}"
      git grep --quiet "$filename';" 1>/dev/null
      found_1=$?
      git grep --quiet "$short_name';" 1>/dev/null
      found_2=$?
      if [ "$found_1" == "1" ] && [ "$found_2" == "1" ]; then
          echo "Unused: $FILE"
      fi
  done;
