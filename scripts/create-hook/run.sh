#!/bin/sh

_deps=( "gum" "jq" )

for _command in ${_deps[@]}; do
	if ( ! command -v $_command &> /dev/null ); then echo "$_command is not found"; exit 0; fi
done


function cancel() {
	echo "❌ Canceled"
	exit 0
}





SCRIPT_PATH=$( realpath $( dirname $0 ) )
RUN_PATH=$( pwd )

NEW_PACKAGE_NAME=$(gum input --placeholder "new package name")

if [[ -z "$NEW_PACKAGE_NAME" ]]; then cancel; fi

cd packages

if ( ! gum confirm "Create new package: $(realpath "./$NEW_PACKAGE_NAME") ?" ); then cancel; fi

mkdir $NEW_PACKAGE_NAME

cp -a "$SCRIPT_PATH/template/." "$RUN_PATH/packages/$NEW_PACKAGE_NAME/"

cd $NEW_PACKAGE_NAME

NAMESPACED_PACKAGE_NAME="@hrpn/$NEW_PACKAGE_NAME"

echo "$( jq --arg package_name "$NAMESPACED_PACKAGE_NAME" '.name = $package_name' package.json )" > package.json

gum style \
	--foreground 212 --border-foreground 57 --border double \
	--align center --width 50 --padding "1 1" \
	"✨ Generated package $NAMESPACED_PACKAGE_NAME ✨" '' '' "cd ./packages/$NEW_PACKAGE_NAME && pnpm install"