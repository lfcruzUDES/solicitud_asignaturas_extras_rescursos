/// <reference path="./App/templateProcess.ts" />

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu("Solicitud de asignaturas")
    .addItem("Ejecución manual", "EXECUTOR")
    .addToUi();
}

function EXECUTOR() {
  TemplateProcess.make();
}
