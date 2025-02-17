var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _generatedLottos, _LottoGenerator_instances, generateLottosByTicketCount_fn, _lottoStatistics, _LottoCalculator_instances, increaseMatchedNumber_fn, increaseMatchedFiveOrBonusNumber_fn, calculateLottoStatistics_fn, calculateAllLottoStatistics_fn, calculateTotalPrice_fn, _ticketCount, _generatedLottos2, _lottoNumbers;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const LOTTO_RULES = {
  minLength: 1,
  maxLength: 45,
  winningNumbersLength: 6,
  bonusMatchCount: 5,
  lottoBaseTicketPrice: 1e3,
  roundingStandard: 100
};
const WEB_MESSAGES = {
  ticketEmoji: "🎟️",
  ticketCount(count) {
    return `총 ${count}개를 구매했습니다.`;
  },
  totalProfit(profit) {
    return `당신의 총 수익률은 ${profit}%입니다.`;
  }
};
const LottoPurchasePriceValidator = {
  validate(price) {
    this.validateDividedUnit(price);
  }
};
class LottoPurchaseForm {
  static validatePurchasePrice(purchasePrice) {
    try {
      LottoPurchasePriceValidator.validate(purchasePrice);
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  }
}
function makeRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
class LottoGenerator {
  constructor(ticketCount) {
    __privateAdd(this, _LottoGenerator_instances);
    __privateAdd(this, _generatedLottos);
    __privateSet(this, _generatedLottos, __privateMethod(this, _LottoGenerator_instances, generateLottosByTicketCount_fn).call(this, ticketCount));
  }
  generateLotto() {
    const { winningNumbersLength, minLength, maxLength } = LOTTO_RULES;
    const lottoSet = /* @__PURE__ */ new Set();
    while (lottoSet.size < winningNumbersLength) {
      const randomNumber = makeRandomInRange(minLength, maxLength);
      lottoSet.add(randomNumber);
    }
    return Array.from(lottoSet).sort((a, b) => a - b);
  }
  get generatedLottos() {
    return __privateGet(this, _generatedLottos);
  }
}
_generatedLottos = new WeakMap();
_LottoGenerator_instances = new WeakSet();
generateLottosByTicketCount_fn = function(ticketCount) {
  return Array.from({ length: ticketCount }, () => this.generateLotto());
};
const LOTTO_STATISTICS = {
  three: {
    price: 5e3,
    number: 3
  },
  four: {
    price: 5e4,
    number: 4
  },
  five: {
    price: 15e5,
    number: 5
  },
  fiveBonus: {
    price: 3e7,
    number: 5
  },
  six: {
    price: 2e9,
    number: 6
  }
};
const COMPARE_LOTTO_COUNT = "fiveBonus";
const OutputWebView = {
  displayTicketCount(count) {
    return WEB_MESSAGES.ticketCount(count);
  },
  displayGeneratedLottos(generatedLottos) {
    const $ul = document.createElement("ul");
    $ul.setAttribute("id", "generated-lotto-contents");
    $ul.setAttribute("class", "generated-lotto-contents");
    generatedLottos.forEach((lotto) => {
      const $li = document.createElement("li");
      $li.textContent = `${WEB_MESSAGES.ticketEmoji} ${lotto.join(", ")}`;
      $ul.appendChild($li);
    });
    return $ul;
  },
  displayStatistics(statistics) {
    const $tbody = document.createElement("tbody");
    $tbody.setAttribute("id", "lotto-statistics-tbody");
    const keys = Object.keys(statistics);
    keys.forEach((key) => {
      const tr = document.createElement("tr");
      const { number, price } = LOTTO_STATISTICS[key];
      const bonusText = key === COMPARE_LOTTO_COUNT ? " + 보너스볼" : "";
      const count = statistics[key];
      const tdKey = document.createElement("td");
      const tdValue = document.createElement("td");
      const tdCount = document.createElement("td");
      tdKey.textContent = `${number}개${bonusText}`;
      tdValue.textContent = `${price.toLocaleString()}원`;
      tdCount.textContent = `${count}개`;
      tr.appendChild(tdKey);
      tr.appendChild(tdValue);
      tr.appendChild(tdCount);
      $tbody.appendChild(tr);
    });
    return $tbody;
  },
  displayTotalProfit(totalProfit) {
    return WEB_MESSAGES.totalProfit(totalProfit);
  }
};
function $(selector) {
  return document.querySelector(selector);
}
function $$(selector) {
  return document.querySelectorAll(selector);
}
class LottoNumbersGenerator {
  static getTicketCount(lottoPurchasePrice) {
    return lottoPurchasePrice / LOTTO_RULES.lottoBaseTicketPrice;
  }
  static generateLottos(ticketCount) {
    const lottoGenerator = new LottoGenerator(ticketCount);
    return lottoGenerator.generatedLottos;
  }
  static displayGeneratedLottoInfo(ticketCount, generatedLottos) {
    this.displayTicketCount(ticketCount);
    this.displayGeneratedLottos(generatedLottos);
  }
  static displayTicketCount(ticketCount) {
    $("#total-ticket-count").textContent = OutputWebView.displayTicketCount(ticketCount);
  }
  static displayGeneratedLottos(generatedLottos) {
    const $generatedLottoContents = $("#generated-lotto-contents");
    if ($generatedLottoContents) {
      $generatedLottoContents.remove();
    }
    $("#generated-lotto-container").appendChild(
      OutputWebView.displayGeneratedLottos(generatedLottos)
    );
  }
}
const LottoValidator = {
  validateWinningNumbers(numbers) {
    this.validateLength(numbers);
    this.validateUniqueNumber(numbers);
    this.validateWinningNumbersRange(numbers);
  },
  validateBonusNumber(winningNumbers, bonusNumber) {
    this.validateRange(bonusNumber);
    this.validateUniqueNumber([...winningNumbers, bonusNumber]);
  }
};
class LottoNumbersForm {
  static setLottoNumbers() {
    const winningNumbers = Array.from($$(".lotto-number-input")).map(
      (input) => Number(input.value)
    );
    const bonusNumber = Number($("#bonus-number-input").value);
    return { winningNumbers, bonusNumber };
  }
  static validateLottoNumbers(lottoNumbers) {
    try {
      LottoValidator.validateWinningNumbers(lottoNumbers.winningNumbers);
      LottoValidator.validateBonusNumber(
        lottoNumbers.winningNumbers,
        lottoNumbers.bonusNumber
      );
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  }
}
class LottoCalculator {
  constructor(lottoNumbers, generatedLottos) {
    __privateAdd(this, _LottoCalculator_instances);
    __privateAdd(this, _lottoStatistics);
    __privateSet(this, _lottoStatistics, {
      three: 0,
      four: 0,
      five: 0,
      fiveBonus: 0,
      six: 0
    });
    __privateMethod(this, _LottoCalculator_instances, calculateAllLottoStatistics_fn).call(this, lottoNumbers, generatedLottos);
  }
  getMatchedNumbersLength(winningNumbers, generatedLotto) {
    return winningNumbers.filter(
      (winningNumber) => generatedLotto.includes(winningNumber)
    ).length;
  }
  isEqualBonusNumber(bonusNumber, generatedLotto) {
    return generatedLotto.includes(bonusNumber);
  }
  calculateTotalProfit(ticketCount) {
    const totalPrice = __privateMethod(this, _LottoCalculator_instances, calculateTotalPrice_fn).call(this);
    const totalProfit = totalPrice / (ticketCount * LOTTO_RULES.lottoBaseTicketPrice) * 0.01;
    return Math.round(totalProfit * LOTTO_RULES.roundingStandard) / LOTTO_RULES.roundingStandard;
  }
  get lottoStatistics() {
    return __privateGet(this, _lottoStatistics);
  }
}
_lottoStatistics = new WeakMap();
_LottoCalculator_instances = new WeakSet();
increaseMatchedNumber_fn = function(number) {
  Object.keys(LOTTO_STATISTICS).forEach((key) => {
    if (LOTTO_STATISTICS[key].number === number) {
      __privateGet(this, _lottoStatistics)[key]++;
    }
  });
};
increaseMatchedFiveOrBonusNumber_fn = function(bonusNumber, generatedLotto) {
  if (this.isEqualBonusNumber(bonusNumber, generatedLotto)) {
    __privateGet(this, _lottoStatistics).fiveBonus++;
    return;
  }
  __privateGet(this, _lottoStatistics).five++;
};
calculateLottoStatistics_fn = function(lottoNumbers, generatedLotto) {
  const { winningNumbers, bonusNumber } = lottoNumbers;
  const count = this.getMatchedNumbersLength(winningNumbers, generatedLotto);
  if (count === LOTTO_RULES.bonusMatchCount) {
    __privateMethod(this, _LottoCalculator_instances, increaseMatchedFiveOrBonusNumber_fn).call(this, bonusNumber, generatedLotto);
    return;
  }
  __privateMethod(this, _LottoCalculator_instances, increaseMatchedNumber_fn).call(this, count);
};
calculateAllLottoStatistics_fn = function(lottoNumbers, generatedLottos) {
  for (let i = 0; i < generatedLottos.length; i++) {
    __privateMethod(this, _LottoCalculator_instances, calculateLottoStatistics_fn).call(this, lottoNumbers, generatedLottos[i]);
  }
};
calculateTotalPrice_fn = function() {
  const totalPrice = Object.keys(LOTTO_STATISTICS).reduce(
    (acc, key) => acc + LOTTO_STATISTICS[key].price * __privateGet(this, _lottoStatistics)[key],
    0
  );
  return totalPrice;
};
class LottoResultModal {
  static calculateAndShowResults(lottoNumbers, generatedLottos, ticketCount) {
    const lottoCalculator = new LottoCalculator(lottoNumbers, generatedLottos);
    this.showLottoStatistics(lottoCalculator);
    this.showTotalProfit(lottoCalculator, ticketCount);
  }
  static showLottoStatistics(lottoCalculator) {
    const lottoStatistics = lottoCalculator.lottoStatistics;
    const $lottoStatisticsBody = $("#lotto-statistics-tbody");
    if ($lottoStatisticsBody) {
      $lottoStatisticsBody.remove();
    }
    $("#lotto-statistics-table").appendChild(
      OutputWebView.displayStatistics(lottoStatistics)
    );
  }
  static showTotalProfit(lottoCalculator, ticketCount) {
    const totalProfit = lottoCalculator.calculateTotalProfit(ticketCount);
    $("#profit-text").textContent = OutputWebView.displayTotalProfit(totalProfit);
  }
}
function openModal() {
  $("#modal-wrapper").classList.remove("hidden-modal");
  $("#modal-wrapper").classList.add("modal-wrapper");
}
function closeModal() {
  $("#modal-wrapper").classList.add("hidden-modal");
  $("#modal-wrapper").classList.remove("modal-wrapper");
}
class LottoWebController {
  constructor() {
    __privateAdd(this, _ticketCount);
    __privateAdd(this, _generatedLottos2);
    __privateAdd(this, _lottoNumbers);
    __privateSet(this, _lottoNumbers, {
      winningNumbers: null,
      bonusNumber: null
    });
    this.initEventListeners();
  }
  initEventListeners() {
    this.initSubmitFormEventListeners();
    this.initCloseModalEventListeners();
    $("#restart-button").addEventListener(
      "click",
      this.handleRestartButton.bind(this)
    );
  }
  initSubmitFormEventListeners() {
    $("#lotto-purchase-form").addEventListener(
      "submit",
      this.handleLottoPurchaseSubmit.bind(this)
    );
    $("#lotto-numbers-form").addEventListener(
      "submit",
      this.handleLottoNumbersSubmit.bind(this)
    );
  }
  initCloseModalEventListeners() {
    $("#close-button").addEventListener("click", closeModal);
    $("#modal-wrapper").addEventListener("click", closeModal);
  }
  handleLottoPurchaseSubmit(event) {
    event.preventDefault();
    const purchasePrice = $("#lotto-purchase-input").value;
    if (LottoPurchaseForm.validatePurchasePrice(purchasePrice)) {
      __privateSet(this, _ticketCount, LottoNumbersGenerator.getTicketCount(purchasePrice));
      __privateSet(this, _generatedLottos2, LottoNumbersGenerator.generateLottos(
        __privateGet(this, _ticketCount)
      ));
      LottoNumbersGenerator.displayGeneratedLottoInfo(
        __privateGet(this, _ticketCount),
        __privateGet(this, _generatedLottos2)
      );
      $("#hidden-form").classList.remove("hidden-form");
    }
  }
  handleLottoNumbersSubmit(event) {
    event.preventDefault();
    __privateSet(this, _lottoNumbers, LottoNumbersForm.setLottoNumbers());
    if (LottoNumbersForm.validateLottoNumbers(__privateGet(this, _lottoNumbers))) {
      openModal();
      LottoResultModal.calculateAndShowResults(
        __privateGet(this, _lottoNumbers),
        __privateGet(this, _generatedLottos2),
        __privateGet(this, _ticketCount)
      );
    }
  }
  handleRestartButton() {
    location.reload();
  }
}
_ticketCount = new WeakMap();
_generatedLottos2 = new WeakMap();
_lottoNumbers = new WeakMap();
new LottoWebController();
