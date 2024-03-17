clean:
ifeq ($(OS),Windows_NT)
	rmdir /S /Q node_modules
	rmdir /S /Q public\css
else
	rm -rf node_modules public/css
endif
run:
	npm install
	npm run sass
	npm run start

dev:
	npm install
	npm run sass
	npm run dev

rebuild:
	make clean
	make build