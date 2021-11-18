## Окружение
Для подключения к БД нужно создать в корне проекта файл
.env со следующим содержанием

PGHOST=<хост бд>
PGUSER=<пользователь>
PGPASSWORD=<пароль>
PGDATABASE=<название бд>
PGPORT=<порт>

БД: postgresql_v14

## Установка

```bash
$ npm install
```

## Запуск приложения

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Тесты

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
