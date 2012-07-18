#!/bin/bash

# This is a deploy script for a static website.
# It compresses html, js, css and some image formats.
#
# Dependencies on external tools:
#
# - htmlcompressor (https://aur.archlinux.org/packages.php?ID=48832)
# - yuicompressor (https://aur.archlinux.org/packages.php?ID=22058)
# - pngcrush (https://aur.archlinux.org/packages.php?ID=22877)
#

SRC="data";
DST="deploy";

if [ -d $DST ]; then
	rm -r $DST;
fi

cp -r $SRC $DST;

# Minify HTML files.
echo "[i] Minify HTML files...";
htmlcompressor $SRC -o "$DST/" -r --remove-intertag-spaces;

# Minify Javascript files.
echo "[i] Minify Javascript files...";
for FILE in `find $DST -type f -name "*.js"`; do
	echo "    $FILE";
	yuicompressor -o "$FILE" "$FILE";
done

# Minify stylesheets.
echo "[i] Minify CSS files...";
for FILE in `find $DST -type f -name "*.css"`; do
	echo "    $FILE";
	yuicompressor -o "$FILE" "$FILE";
done

# Crush PNG files.
echo "[i] Crushing PNG files...";
for FILE in `find $DST -type f -name "*.png"`; do
	echo "    $FILE";
	pngcrush -q -z 3 -reduce "$FILE" "$FILE.new" 1>/dev/null;

	if [ $? -ne 0 ]; then
		exit $?;
	fi

	cp -f "$FILE.new" "$FILE";
	rm -f "$FILE.new";
done

echo "[i] Done.";
exit $?;
