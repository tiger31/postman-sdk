# Postman automation SDK

[![codecov](https://codecov.io/gh/tiger31/postman-sdk/branch/master/graph/badge.svg?token=ZLMW30R068)](https://codecov.io/gh/tiger31/postman-sdk)

## Что это и как оно работает в Postman
Postman поддерживает среду исполнения **Node.js**, что позволяет использовать всю мощь языка JavaScript. В Postman есть _два места_ где можно использовать JS - **Pre-request scripts** и **Test**. Проблема в том, что в Postman не предусмотрены механизмы шаринга кода между коллекциями и запросами, и эта _SDK_ призвана это иправить.

**Как?**

Весь код, который нужен нам в будущем, оборачивается в фунцию, от которой вызывается метод `toSource` который првращает весь исходных код в строку. Строка записывается в переменную коллекции под каким-нибудь *well-known* именем и когда функциональность нужна, вызывается `eval()` от значения переменной.

В моем случае код хранитсая в переменной **Pre-request скрипте** коллекции и экспортируется в переменную `_utils`. Поэтому, чтобы добраться до все функциональности SDK, нужно добавить вот такую конструкцию:
```js
const utils = eval(pm.collectionVariables.get('_utils'))
```

**Что это нам дает?** Ответы ниже

## Продвинутое управление переменными
Экспортировать JS или даже объект - достаточно простая задача, зная Postamn API, перебирая ключи и каждый раз вызывая `pm.scope.set(key, value)`
```js
for (const key in obj)
    pm.variables.set(key, obj[key])
```

Что насчет чего-то посложнее - экспортируем объект с вложенностями на всех его уровнях в переменные Postman'а. Код я приводить не буду, его можно найти в модуле `export._deepExportObject`. Вот пример того, что она может:

```js
const foo = {
  foo: {
    bar: 42,
    baz: 43
  },
  bar: "qwerty"
}
``` 
Превращается в несколько переменных в **variable** скуопе (слева - ключ переменной в Postman, ее значение после `=`):
```
foo.foo = "{\"bar\":42,\"43\"}"
foo.foo.bar = 42
foo.foo.baz = 43
foo.bar = "qwertry"
```
