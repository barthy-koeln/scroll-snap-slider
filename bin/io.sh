#!/usr/bin/env bash

# Reset
RESET='\033[0m'

RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'

colored_output() {
  # $1: Color
  # $2: Text
  echo -e "$1$2${RESET}"
}

tagged_output() {
  # $1: Color
  # $2: Tag
  # $3: After tag
  # $4: Before tag (tabs, newlines, ...)
  echo -e "$4$(colored_output "$1" "[$2]") $3"
}

success() {
  tagged_output "$GREEN" '✔' "$1" "$2"
}

info() {
  tagged_output "$BLUE" 'ℹ' "$1" "$2"
}

warning() {
  tagged_output "$YELLOW" '❗' "$1" "$2"
}

error() {
  tagged_output "$RED" '✘' "$1" "$2"
}
