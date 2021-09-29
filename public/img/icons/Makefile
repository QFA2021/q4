# ugly as shit. Too tired to fix.
BASEDIR:=$(dir $(realpath $(firstword $(MAKEFILE_LIST))))

ANDROID_CHROME_WH=192 512
ANDROID_CHROME_MASKABLE_WH=192 512
APPLE_TOUCH_ICON_WH=60 76 120 152 180
FAVICON_WH=16 32

TARGETS=$(foreach size,${ANDROID_CHROME_WH},android-chrome-${size}x${size}.png)
TARGETS+=$(foreach size,${ANDROID_CHROME_MASKABLE_WH},android-chrome-maskable-${size}x${size}.png)
TARGETS+=$(foreach size,${APPLE_TOUCH_ICON_WH},apple-touch-icon-${size}x${size}.png)
TARGETS+=$(foreach size,${FAVICON_WH},favicon-${size}x${size}.png)

TARGETS+=msapplication-icon-144x144.png
TARGETS+=mstile-150x150.png
TARGETS+=apple-touch-icon.png

#$(info $(TARGETS))

all: $(TARGETS)
.PHONY: all

# args: name, whsize
define convertToPNG
$(info create target: ${1}-${2}x${2}.png)
${1}-${2}x${2}.png: ${BASEDIR}/../../favicon.svg
	inkscape --export-type=png -w $2 -h $2 -C -o $1-$2x$2.png ${BASEDIR}/../../favicon.svg
#echo '${BASEDIR}/../../ $1-$2x$2.png'
endef

$(foreach size,$(ANDROID_CHROME_WH),$(eval $(call convertToPNG,android-chrome,$(size))))
$(foreach size,$(ANDROID_CHROME_MASKABLE_WH),$(eval $(call convertToPNG,android-chrome-maskable,$(size))))
$(foreach size,$(APPLE_TOUCH_ICON_WH),$(eval $(call convertToPNG,apple-touch-icon,$(size))))
$(foreach size,$(FAVICON_WH),$(eval $(call convertToPNG,favicon,$(size))))

$(foreach size,144,$(eval $(call convertToPNG,msapplication-icon,$(size))))
$(foreach size,150,$(eval $(call convertToPNG,mstile,$(size))))

$(shell inkscape --export-type=png -w 180 -h 180 -C -o apple-touch-icon.png ${BASEDIR}/../../favicon.svg )
