#!/bin/bash

echo '########################################################################################'
echo '#  CAUTION: This tool does not guarantee the files found are not referenced anywhere.  #'
echo '#  If the file is referenced dynamically or if the file is referenced from outside of  #'
echo '#  the source directory, then this tool may not catch it. So before deleting any file  #'
echo '#  it detected please MANUALLY confirm that the file is indeed a dangling file.        #'
echo '########################################################################################'

echo ''

echo 'This is going to run for up to several minutes depending on the number of files in the directory you provided. Please be patient.'

usage() {
    echo "Usage: $0 <path_to_source_directory>"
    echo "For example, in sui repo, run 'cd frontends/goldeneye && ./bin/dangling-file-detector.sh src'"
    exit 1
}

while getopts ":h" opt; do
  case $opt in
    *)
      usage
      ;;
  esac
done

shift $((OPTIND - 1))

if [ $# -ne 1 ] || [ ! -d "$1" ]; then
    usage
fi

cd "$1"

root_path='.'

escaped_root_path=$(sed -e 's/[\.\/&]/\\&/g' <<< "$root_path")

all_files=()
all_references=()

# All valid references:
# import { whatever } from '../test.vue'      // simplest format, relative path with full file name.
# import { whatever } from './test'           // 'test' can be either a file test.ts, or a file test.d.ts, or a folder with index.ts inside
# import { whatever } from '@/test'           // shortcut referring to src/test, see tsconfig.json
# export { whatever } from './test'           // There is no easy way to check if the exported member is referenced.
# import('@/test.vue')                        // dynamic import. The file path can be assembled at runtime and in this case there is no way we can handle it.
# require('./test.vue')                       // ditto
# <img src="./images/stop-sell.svg" />

# references we don't check:
# import { whatever } from 'vue'              // third party imports
# import { whatever } from '@siteminder/test' // also proprietary or third party imports

iterate_folder() {

  for file_folder in $(ls "$1"); do

    full_path="$1/$file_folder"

    if [ -d "$full_path" ]; then
      iterate_folder $full_path
    else

      full_path=$(readlink -f "$full_path")
      if [ $? -ne 0 ]; then
        echo "path not valid in iteration: $full_path" 1>&2
        exit 1
      fi

      # Skip files with extensions: 'lang.json', 'sh', 'scss', 'spec.ts', 'test.ts', 'types.d.ts', 'cy.ts', 'md'
      if grep -qE '(\.(test|spec)\.ts|\.lang\.json|\.sh|\.scss|\.types\.d\.ts|\.cy\.ts|\.md)$' <<< $full_path; then
        :
      else
        all_files=("${all_files[@]}" $full_path)
      fi

      # Only analyse ts, js and vue files
      grep -qE '(\.vue|\.js|\.ts)$' <<< $full_path

      [ $? -ne 0 ] && continue

      escaped_current_path=$(sed -e 's/[\.\/&]/\\&/g' <<< "$1")

      file_imports=$(sed -nE -e "s/^.* from \'((\.\.\/|\.\/|@\/).*)\'.*/\1/p" -e "s/^.*(require|import)\(.*'((\.\.\/|\.\/|@\/).*)'.*/\2/p" -e 's/^.*src="(\..*)".*/\1/p' $full_path |
        sed -E "s/^\.\//$escaped_current_path\//" |
        sed -E "s/^\.\.\//$escaped_current_path\/\.\.\//" |
        sed -E -e "s/^@/$escaped_root_path/")
      
      # references to vue file in test files don't count as a reference
      if grep -qE '(\.spec\.js|\.spec\.ts|\.test\.js|\.test\.ts)$' <<< $full_path; then
        file_imports=$(sed -E '/\.vue$/d' <<< $file_imports)
      fi

      for file_import in $file_imports; do

        formatted_file="$file_import"

        if [ -f "$formatted_file" ]; then
          :
        elif [ -f "${formatted_file}.ts" ]; then
          formatted_file="${formatted_file}.ts"
        elif [ -f "${formatted_file}.d.ts" ]; then
          formatted_file="${formatted_file}.d.ts"
        else
          formatted_file="${formatted_file}/index.ts"
        fi

        # sanitise paths - get absolute path
        file_import_full_path=$(readlink -f "$formatted_file")

        if [ $? -ne 0 ]; then
          echo "Path not valid in import: $file_import in $full_path. Please check." 1>&2
          continue
        fi

        all_references=("${all_references[@]}" "$file_import_full_path")

      done

    fi

  done
}

iterate_folder "$root_path"

echo ''
echo 'Here is a list of unused files:'
echo ''

for file in "${all_files[@]}"; do
  found=0

  for file_import in "${all_references[@]}"; do
    if [ "$file" = "$file_import" ]; then
      found=1
      break
    fi
  done

  if [ "$found" -eq 0 ]; then
    echo "$file"
  fi

done
