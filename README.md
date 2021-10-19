# JINKS

< 1kB link matcher

## Installation

```sh
npm i @barelyhuman/jinks
# or
yarn add @barelyhuman/jinks
```

## Usage

```
import {jinks} from "@barelyhuman/jinks"

const parsed = jinks("Lorem Ipsum is https://github.com/barelyhuman of the https://google.com");

console.log(parsed[0].value)  // Lorem Ipsum is
console.log(parsed[0].isLink) // false

console.log(parsed[1].value)  // https://github.com/barelyhuman
console.log(parsed[1].isLink) // true

console.log(parsed[2].value)  // of the
console.log(parsed[2].isLink) // false

console.log(parsed[3].value)  // https://google.com
console.log(parsed[3].isLink) // true

```
