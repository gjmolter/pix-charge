# pix-charge

[![bundle size][bundlephobia-image]][bundlephobia-url]

[bundlephobia-url]: https://bundlephobia.com/result?p=pix-charge
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/pix-charge

Library to generate BCB's Pix Payment BR Code

## Install 📦

```bash
#NPM
npm i pix-charge

#YARN
yarn add pix-charge
```

## Usage ✍️

```js
import { dinamicPix, staticPix } from "pix-charge";

let brCode = staticPix({
  merchantKey: "gjmolter.1997@gmail.com",
  merchantName: "Gabriel Molter",
});
```

## QRCode 🤳

This lib was created with the goal of being as small and simple as possible, therefore, it only creates the BR Code.
If you need to transform it into a QR Code, there are many ways to do it. I recomend using the `qrcode` lib. Here is an example:

On your HTML, create an Canvas element with an id

```html
<canvas id="canvas"></canvas>
```

Then use `.toCanvas` to create a QR Code from the BR Code

```js
import { dinamicPix, staticPix } from "pix-charge";

let brCode = staticPix({
  merchantKey: "gjmolter.1997@gmail.com",
  merchantName: "Gabriel Molter",
});

QRCode.toCanvas(document.getElementById("canvas"), brCode, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log("success!");
  }
});
```

## Params 🎛️

### staticPix()

| param        | type    | required |
| ------------ | ------- | -------- |
| merchantKey  | string  | ✅       |
| merchantName | string  | ✅       |
| amount       | number  | ❌       |
| merchantCity | string  | ❌       |
| merchantCep  | string  | ❌       |
| description  | string  | ❌       |
| isUnique     | boolean | ❌       |

### dinamicPix()

| param        | type    | required |
| ------------ | ------- | -------- |
| merchantName | string  | ✅       |
| location     | string  | ✅       |
| amount       | number  | ❌       |
| merchantCity | string  | ❌       |
| merchantCep  | string  | ❌       |
| isUnique     | boolean | ❌       |

### merchantKey

The `merchantKey` can be any DICT key: Email, CPF, CNPJ, Telephone or EVP

- Email: gjmolter.1997@gmail.com (regular email string)
- CPF: 12345678900 (11 characters, no separators)
- CPF: 00038166000105 (14 characters, no separators)
- Telephone: +5561912345678 (string starting with +, then country code, area code and actual phone number)
- EVP: 123e4567-e12b-12d1-a456-426655440000 (string with lowercase characters with separators)

## More info from BCB

[BCB - Iniciação do Pix](https://www.bcb.gov.br/content/estabilidadefinanceira/forumpireunioes/AnexoI-PadroesParaIniciacaodoPix.pdf)

## License

MIT © [gjmolter](https://github.com/gjmolter)
