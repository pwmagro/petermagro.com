clean:
ifeq ($(OS),Windows_NT)
	rmdir /S /Q node_modules
	rmdir /S /Q public\css
else
	rm -rf ./node_modules ./public/css
endif

run:
	make init
	npm run start


dev:
	make init
	npm run dev


init:
	npm install
	npm run sass