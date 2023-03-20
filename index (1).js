const TelegramBot = require('node-telegram-bot-api');

const token = '6197709226:AAFVOdeil0Gnfzyh1EhOfzFT-WgvAowW2hI';

const TronWeb = require("tronweb");

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.nileex.io");
const solidityNode = new HttpProvider("https://api.nileex.io");
const eventServer = "https://api.nileex.io";
const privateKey = "bdd82b8797e761445bf5b4e09431a33de4aa80319ee570edf4962b37e1895e37";

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
const contractAddress = 'TFnWi5CYC2T93YkvW81rXXXCxh898nZ9M3';
const contractABI = JSON.parse('{"entrys":[{"outputs":[{"type":"string"}],"constant":true,"name":"name","stateMutability":"View","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"newTransactionFee","type":"uint256"}],"name":"setTransactionFee","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"totalSupply","stateMutability":"View","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"sender","type":"address"},{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferFrom","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint8"}],"constant":true,"name":"decimals","stateMutability":"View","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"account","type":"address"},{"name":"amount","type":"uint256"}],"name":"mint","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"burn","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"newBurnFee","type":"uint256"}],"name":"setBurnFee","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"account","type":"address"},{"name":"isWhitelisted","type":"bool"}],"name":"setWhitelist","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"recipients","type":"address[]"},{"name":"amounts","type":"uint256[]"}],"name":"airdrop","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"balanceOf","stateMutability":"View","type":"Function"},{"name":"renounceOwnership","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"getTransactionFee","stateMutability":"View","type":"Function"},{"inputs":[{"name":"recipients","type":"address[]"},{"name":"amounts","type":"uint256[]"}],"name":"batchTransfer","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"owner","stateMutability":"View","type":"Function"},{"outputs":[{"type":"bool"}],"constant":true,"name":"isOwner","stateMutability":"View","type":"Function"},{"outputs":[{"type":"string"}],"constant":true,"name":"symbol","stateMutability":"View","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"getBurnFee","stateMutability":"View","type":"Function"},{"inputs":[{"name":"newValue","type":"uint256"}],"name":"rebase","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","stateMutability":"View","type":"Function"},{"inputs":[{"name":"newMETRXFee","type":"uint256"}],"name":"setMETRXFee","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","stateMutability":"Nonpayable","type":"Function"},{"stateMutability":"Nonpayable","type":"Constructor"},{"inputs":[{"name":"newTransactionFee","type":"uint256"}],"name":"TransactionFeeSet","type":"Event"},{"inputs":[{"name":"newBurnFee","type":"uint256"}],"name":"BurnFeeSet","type":"Event"},{"inputs":[{"indexed":true,"name":"account","type":"address"},{"name":"isWhitelisted","type":"bool"}],"name":"WhitelistUpdated","type":"Event"},{"inputs":[{"indexed":true,"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"Airdropped","type":"Event"},{"inputs":[{"name":"oldValue","type":"uint256"},{"name":"newValue","type":"uint256"}],"name":"Rebasing","type":"Event"},{"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"Event"},{"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"Transfer","type":"Event"},{"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"Approval","type":"Event"}]}');


const bot = new TelegramBot(token, { polling: true });
const contract = tronWeb.contract(contractABI, contractAddress);


bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Добро пожаловать! Введите команду для управления вашим смарт-контрактом.');
});

bot.onText(/\/balance(?:\s+([a-zA-Z0-9]+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const inputAddress = match[1]; // получить адрес из введенного текста
  let contract;

  try {
    contract = await tronWeb.contract(contractABI).at(contractAddress);
  } catch (error) {
    console.error("Ошибка при создании контракта:", error);
  }

  const addressToCheck = inputAddress || tronWeb.defaultAddress.base58; // использовать введенный адрес или адрес по умолчанию

  if (!tronWeb.isAddress(addressToCheck)) {
    bot.sendMessage(chatId, "Неверный формат адреса.");
    return;
  }

  const balance = await contract.balanceOf(addressToCheck).call();
  const formattedBalance = tronWeb.fromSun(balance);

  bot.sendMessage(
    chatId,
    `Баланс адреса ${addressToCheck}: ${formattedBalance} Алефиков`
  );
});


bot.onText(/\/transfer (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match[1].split(' ');
  const recipient = args[0];
  const amount = tronWeb.toSun(parseFloat(args[1]));

  if (!tronWeb.isAddress(recipient)) {
    bot.sendMessage(chatId, 'Неверный адрес получателя.');
    return;
  }

  const contract = await tronWeb.contract(contractABI).at(contractAddress);
  const result = await contract.transfer(recipient, amount).send();

  bot.sendMessage(chatId, `Перевод выполнен. Транзакция: ${result}`);
});

// Новые обработчики команд

bot.onText(/\/totalsupply/, async (msg) => {
  const chatId = msg.chat.id;
  const contract = await tronWeb.contract(contractABI).at(contractAddress);
  const totalSupply = await contract.totalSupply().call();

  bot.sendMessage(chatId, `Общее количество выпущенных токенов: ${tronWeb.fromSun(totalSupply)} TRX`);
});

bot.onText(/\/setTransactionFee (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const transactionFee = parseFloat(match[1]);

  if (transactionFee < 0 || transactionFee > 100) {
    bot.sendMessage(chatId, "Ошибка: комиссия должна быть в диапазоне от 0 до 100.");
    return;
  }

  const contract = await tronWeb.contract(contractABI).at(contractAddress);
  const result = await contract.setTransactionFee(transactionFee).send();

  bot.sendMessage(chatId, `Комиссия за транзакцию изменена на ${transactionFee}%. Транзакция: ${result}`);
});

bot.onText(/\/setBurnFee (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const burnFee = parseFloat(match[1]);

  if (burnFee < 0 || burnFee > 100) {
    bot.sendMessage(chatId, "Ошибка: комиссия должна быть в диапазоне от 0 до 100.");
    return;
  }

  const contract = await tronWeb.contract(contractABI).at(contractAddress);
  const result = await contract.setBurnFee(burnFee).send();

  bot.sendMessage(chatId, `Комиссия за сжигание изменена на ${burnFee}%. Транзакция: ${result}`);
});

bot.onText(/\/isWhitelisted (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const address = match[1];

  if (!tronWeb.isAddress(address)) {
    bot.sendMessage(chatId, 'Неверный адрес.');
    return;
  }

  // Инициализация контракта
  const contract = await tronWeb.contract(contractABI).at(contractAddress);

  const isWhitelisted = !(await contract.isWhitelisted(address).call());
  bot.sendMessage(chatId, isWhitelisted ? 'Адрес в белом списке.' : 'Адрес не в белом списке.');
});

bot.onText(/\/batchTransfer (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match[1].split(' ');
  const recipients = args[0].split(','); // Разделитель для получателей: запятая
  const amount = tronWeb.toSun(parseFloat(args[1]));

  const contract = await tronWeb.contract(contractABI).at(contractAddress);
  const result = await contract.batchTransfer(recipients, amount).send();

  bot.sendMessage(chatId, `Массовый перевод выполнен. Транзакция: ${result}`);
});

bot.onText(/\/rebase (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const supplyDelta = parseInt(match[1]);

  if (isNaN(supplyDelta)) {
    bot.sendMessage(chatId, 'Ошибка: введите корректное число.');
    return;
  }

  try {
    const contract = await tronWeb.contract(contractABI).at(contractAddress);
    // Убедитесь, что в ABI смарт-контракта есть функция rebase
    if (typeof contract.rebase === 'function') {
      const result = await contract.rebase(supplyDelta).send();
      bot.sendMessage(chatId, 'Успешное изменение общего предложения. Транзакция: ' + result);
    } else {
      bot.sendMessage(chatId, 'Ошибка: функция rebase не найдена в ABI смарт-контракта.');
    }
  } catch (error) {
    bot.sendMessage(chatId, `Ошибка при вызове функции rebase: ${error.message}`);
  }
});





bot.onText(/\/airdrop (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match[1].split(' ');
  const recipients = args[0].split(','); // Разделитель для получателей: запятая
  const amounts = args[1].split(',').map(x => tronWeb.toSun(parseFloat(x)));

  const contract = await tronWeb.contract(contractABI).at(contractAddress);
  const result = await contract.airdrop(recipients, amounts).send();

  bot.sendMessage(chatId, `Airdrop выполнен. Транзакция: ${result}`);
});

bot.onText(/\/mint (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const args = match[1].split(' ');
    const recipient = args[0];
    const amount = tronWeb.toSun(parseFloat(args[1]));

    if (!tronWeb.isAddress(recipient)) {
        bot.sendMessage(chatId, 'Неверный адрес получателя.');
        return;
    }

    const contract = await tronWeb.contract(contractABI).at(contractAddress);
    const result = await contract.mint(recipient, amount).send();

    bot.sendMessage(chatId, `Mint выполнен. Транзакция: ${result}`);
});


bot.onText(/\/burn (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const amount = tronWeb.toSun(parseFloat(match[1]));

  const contract = await tronWeb.contract(contractABI).at(contractAddress);
  const result = await contract.burn(amount).send();

  bot.sendMessage(chatId, `Сжигание токенов выполнено на сумму ${tronWeb.fromSun(amount)} TRX. Транзакция: ${result}`);
});

bot.onText(/\/setMETRX (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const metrxPercentage = parseFloat(match[1]);

  const contract = await tronWeb.contract(contractABI).at(contractAddress);
  const result = await contract.setMETRX(metrxPercentage).send();

  bot.sendMessage(chatId, `METRX установлен на ${metrxPercentage}%. Транзакция: ${result}`);
});


bot.onText(/\/approve (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match[1].split(' ');
  const spender = args[0];
  const amount = tronWeb.toSun(parseFloat(args[1]));

  if (!tronWeb.isAddress(spender)) {
    bot.sendMessage(chatId, 'Неверный адрес.');
    return;
  }

  const contract = await tronWeb.contract(contractABI).at(contractAddress);
  const result = await contract.approve(spender, amount).send();

  bot.sendMessage(chatId, `Одобрено. Транзакция: ${result}`);
});

bot.onText(/\/allowance (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match[1].split(' ');
  const owner = args[0];
  const spender = args[1];

  if (!tronWeb.isAddress(owner) || !tronWeb.isAddress(spender)) {
    bot.sendMessage(chatId, 'Неверный адрес.');
    return;
  }

  const contract = await tronWeb.contract(contractABI).at(contractAddress);
  const allowance = await contract.allowance(owner, spender).call();

  bot.sendMessage(chatId, `Одобренное количество токенов: ${tronWeb.fromSun(allowance)} TRX`);
});

bot.onText(/\/increaseAllowance (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match[1].split(' ');
  const spender = args[0];
  const addedValue = tronWeb.toSun(parseFloat(args[1]));

  if (!tronWeb.isAddress(spender)) {
    bot.sendMessage(chatId, 'Неверный адрес.');
    return;
  }

  const contract = await tronWeb.contract(contractABI).at(contractAddress);
  const result = await contract.increaseAllowance(spender, addedValue).send();

  bot.sendMessage(chatId, `Увеличено одобренное количество токенов. Транзакция: ${result}`);
});

bot.onText(/\/decreaseAllowance (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match[1].split(' ');
  const spender = args[0];
  const subtractedValue = tronWeb.toSun(parseFloat(args[1]));

  if (!tronWeb.isAddress(spender)) {
    bot.sendMessage(chatId, 'Неверный адрес.');
    return;
  }

  const contract = await tronWeb.contract(contractABI).at(contractAddress);
  const result = await contract.decreaseAllowance(spender, subtractedValue).send();

  bot.sendMessage(chatId, `Уменьшено одобренное количество токенов. Транзакция: ${result}`);
});

