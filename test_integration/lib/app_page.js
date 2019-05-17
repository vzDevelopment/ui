const {until} = require('selenium-webdriver');

const AppPageSelector = require('./app_page_selector.js');
const FnPage = require('./fn_page.js');

module.exports = class AppPage extends FnPage {

  _fnTableRowSelector(fnName) {
    return `#fnTable tr[name="${fnName}"]`;
  }

  async _getFnAttribute(fnName, elementDetails) {
    await this.openEditFn(fnName);

    let inputField =
      await this.findByElementDetails(elementDetails);
    return await inputField.getAttribute('value');
  }

  async loadedCorrectly() {
    let fnTable = await this.getFnTable();
    let fnTableText = await fnTable.getText();
    return fnTableText.includes('No Functions');
  }

  async openCreateFn() {
    let openCreateFnBtn =
      await this.findByElementDetails(AppPageSelector.openCreateFnBtn());
    await openCreateFnBtn.click();
  }

  async getFnTable() {
    return await this.findByElementDetails(AppPageSelector.fnTable());
  }

  async getFnTableRow(fnName) {
    return await this.findByElementDetails(AppPageSelector.fnTableRow(fnName));
  }

  async createFn(fnDetails) {
    await this.openCreateFn();
    await this._fillFormDetails(fnDetails.getAttributes());
    await this.submitFn();
    await this.getFnTableRow(fnDetails.name);
  }

  async openEditFn(fnName) {
    await this.openFnOptions(fnName);
    let openEditFnBtn =
      await this.findByElementDetails(AppPageSelector.openEditFnBtn(fnName));
    await openEditFnBtn.click();
  }

  async editFn(fnDetails) {
    await this.openEditFn(fnDetails.name);
    await this._fillFormDetails(fnDetails.getEditableAttributes());
    await this.submitFn();
  }

  async submitFn() {
    let submitFnBtn =
      await this.findByElementDetails(AppPageSelector.submitFnBtn());
    await submitFnBtn.click();
  }

  async openFnOptions(fnName) {
    let moreOptionsBtn =
      await this.findByElementDetails(AppPageSelector.openMoreOptionsBtn(fnName));
    await moreOptionsBtn.click();
  }

  async deleteFn(fnName) {
    await this.openFnOptions(fnName);

    let deleteBtn =
      await this.findByElementDetails(AppPageSelector.deleteFnBtn(fnName));
    await deleteBtn.click();

    let deleteConfirmation = await this.driver.wait(
      until.alertIsPresent(), 10000, 'Waiting for alert');
    await deleteConfirmation.accept();
  }

  async getFnImage(fnName) {
    return await this._getFnAttribute(fnName, AppPageSelector.fnImageInput());
  }

  async getFnMemory(fnName) {
    return await this._getFnAttribute(fnName, AppPageSelector.fnMemoryInput());
  }

  async getFnTimeout(fnName) {
    return await this._getFnAttribute(fnName, AppPageSelector.fnTimeoutInput());
  }

  async getFnIdleTimeout(fnName) {
    return await this._getFnAttribute(
      fnName, AppPageSelector.fnIdleTimeoutInput()
    );
  }
};