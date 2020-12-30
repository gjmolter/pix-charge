import { parse } from "path";
import computeCRC from "./crc";

/*
BR Code Generation Manual Available at:
https://www.bcb.gov.br/content/estabilidadefinanceira/forumpireunioes/AnexoI-PadroesParaIniciacaodoPix.pdf
*/

function addLeftZero(value: number): string | number {
  return value < 10 ? `0${value}` : value;
}

function formatText(value: string): string {
  var str = value.toUpperCase().replace("Ç", "C");
  return str.normalize("NFD").replace(/[^A-Z0-9$%*+-\./:]/gi, " ");
}

type ParamsStatic = {
  merchantKey: string
  merchantName: string
  amount?: number
  merchantCity?: string
  merchantCep?: string
  description?: string
  isUnique?: boolean
}

export function staticPix({
  merchantKey = "",
  merchantName = "",
  amount,
  merchantCity,
  merchantCep,
  description,
  isUnique
}: ParamsStatic ): string {

  // Get formatted variables
  const merchantNameF = formatText(merchantName);
  const merchantCityF = formatText(merchantCity || "");
  const merchantCepF = formatText(merchantCep || "");
  const descriptionF = formatText(description || "");
  const amountF = amount ? amount.toFixed(2).toString() : "0";

  // Check for input problems
  if (merchantKey.length < 1 || merchantNameF.length < 1) {
    throw "merchantKey and merchantName are mandatory fields";
  }
  if (merchantNameF.length > 25) {
    throw "merchantName has a max of 25 characters";
  }
  if (merchantCityF.length > 15) {
    throw "merchantCity has a max of 15 characters";
  }
  if (amountF.length > 13) {
    throw "Amount has a maximum of 13 characters";
  }

  // Start crafting the code
  var brCode = [];

  brCode.push("000201"); // Payload Format Indicator
  if (isUnique) brCode.push("010212"); // BRCode can be used only once

  var extra = 22;
  if (descriptionF !== "") {
    extra += descriptionF.length + 4;
  }

  brCode.push(`26${merchantKey.length + extra}`); 
  brCode.push("0014br.gov.bcb.pix"); // GUI
  brCode.push(`01${addLeftZero(merchantKey.length)}${merchantKey}`); // Pix Key
 
  if (descriptionF !== "") {
    brCode.push(`02${addLeftZero(descriptionF.length)}${descriptionF}`); // Description
  }

  brCode.push("52040000"); // Merchant Category Code (0000 = não informado)
  brCode.push("5303986"); // Transaction Currency (989 = R$)

  if(parseFloat(amountF) >= 0.01){
    brCode.push(`54${addLeftZero(amountF.length)}${amountF}`); // R$ Amount
  }

  brCode.push("5802BR"); // Country Code

  brCode.push(`59${addLeftZero(merchantNameF.length)}${merchantNameF}`); // Merchant Name

  if (merchantCityF !== "") {
    brCode.push(`60${addLeftZero(merchantCityF.length)}${merchantCityF}`); // Merchant City
  }

  if (merchantCepF !== "") {
    brCode.push(`61${addLeftZero(merchantCepF.length)}${merchantCepF}`); // Merchant CEP
  }

  brCode.push("6304"); // CRC16

  var brCodeString = brCode.join("");
  return `${brCodeString}${computeCRC(brCodeString)}`;
}

type ParamsDinamic = {
  merchantName: string
  merchantCity?: string
  merchantCep?: string
  amount: number
  location: string
  isUnique?: boolean
}

export function dinamicPix({
  merchantName,
  merchantCity,
  merchantCep,
  amount,
  location,
  isUnique
} : ParamsDinamic) : string {
  // Get formatted variables
  const merchantNameF = formatText(merchantName);
  const merchantCityF = formatText(merchantCity || "");
  const merchantCepF = formatText(merchantCep || "");
  const amountF = amount ? amount.toFixed(2).toString() : "0";
  const locationF = location.replace('https://', '')

  // Check for input problems
  if (merchantNameF.length < 1 || locationF.length < 1 || amountF.length < 1) {
    throw "merchantName, amount and location are mandatory fields";
  }
  if (merchantNameF.length > 25) {
    throw "merchantName has a max of 25 characters";
  }
  if (merchantCityF.length > 15) {
    throw "merchantCity has a max of 15 characters";
  }
  if (amountF.length > 13) {
    throw "Amount has a maximum of 13 characters";
  }
  if(parseFloat(amountF) < 0.01){
    throw "Amount needs to be at least 0.01";
  }

  // Start crafting the code
  var brCode = [];

  brCode.push("000201"); // Payload Format Indicator
  if (isUnique) brCode.push("010212"); // BRCode can be used only once

  brCode.push(`26${locationF.length + 22}`)
  brCode.push("0014br.gov.bcb.pix")
  brCode.push(`25${addLeftZero(locationF.length)}${locationF}`) // Location
 
  brCode.push("52040000"); // Merchant Category Code (0000 = não informado)
  brCode.push("5303986"); // Transaction Currency (989 = R$)

  brCode.push(`54${addLeftZero(amountF.length)}${amountF}`); // R$ Amount

  brCode.push("5802BR"); // Country Code

  brCode.push(`59${addLeftZero(merchantNameF.length)}${merchantNameF}`); // Merchant Name

  if (merchantCityF !== "") {
    brCode.push(`60${addLeftZero(merchantCityF.length)}${merchantCityF}`); // Merchant City
  }

  if (merchantCepF !== "") {
    brCode.push(`61${addLeftZero(merchantCepF.length)}${merchantCepF}`); // Merchant CEP
  }

  brCode.push("62070503***") // Additional Data Field

  brCode.push("6304"); // CRC16

  var brCodeString = brCode.join("");
  return `${brCodeString}${computeCRC(brCodeString)}`;
}