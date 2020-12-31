import { dinamicPix, staticPix } from "../src/index";

// SIMPLEST EXAMPLE (STATIC)
// No amount, so users can choose the value by themselves.

console.log(
  staticPix({
    merchantKey: "gjmolter.1997@gmail.com",
    merchantName: "Gabriel Molter",
  })
);

// STATIC EXAMPLE
// Amount is pre-defined. Code can only be used for one payment.

console.log(
  staticPix({
    merchantKey: "gjmolter.1997@gmail.com",
    merchantName: "Gabriel Molter",
    amount: 5,
    description: 'Buy me a beer',
    isUnique: true,
    merchantCep: '25680010',
    merchantCity: 'Petrópolis'
  })
);

// DINAMIC EXAMPLE
// Amount is pre-defined and location is a URL from where a JWT will be retrieved with transaction details.

console.log(
  dinamicPix({
    location: 'pix.gabrielmolter.com/b009da1d-3993-4c94-8cc2-364d095e7221', //I didn't go through the trouble of getting certifications, so this example URL won't work.
    merchantName: "Gabriel Molter",
    amount: 30.0
  })
);
