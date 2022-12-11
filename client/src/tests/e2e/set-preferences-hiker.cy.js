/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("get and set preferences hiker", () => {
    it("get and set preferences", () => {
        cy.visit("http://localhost:3000/login");
        cy.get('[data-test-id="email"]').type("vittorioarpino@test.it");
        cy.get('[data-test-id="password"').type("password");
        cy.get("button").click();
        cy.get('[data-test-id="user-dropdown"]').click();
        cy.get('[data-test-id="profile-button"]').click();
        cy.get('[data-test-id="set-preferences-button"]').click();
        cy.get('[data-test-id="min-length"]').type(500);
        cy.get('[data-test-id="max-length"]').type(1000);
        cy.get('[data-test-id="min-ascent"]').type(0);
        cy.get('[data-test-id="max-ascent"]').type(200);
        cy.get('[data-test-id="min-expected-time"]').type(30);
        cy.get('[data-test-id="max-expected-time"]').type(120);
        cy.get('[data-test-id="difficulty"]').select("hiker");
        cy.get('[data-test-id="select-area"]').click();
        cy.get('[data-test-id="position-ok-button"]').click();
        cy.get('[data-test-id="save-preferences-button"]').click();
        cy.get('[data-test-id="confirm-save-preferences"]').click();
    });
});
describe("Delete preferences hiker", () => {
    it("delete preferences", () => {
        cy.visit("http://localhost:3000/login");
        cy.get('[data-test-id="email"]').type("vittorioarpino@test.it");
        cy.get('[data-test-id="password"').type("password");
        cy.get("button").click();
        cy.get('[data-test-id="user-dropdown"]').click();
        cy.get('[data-test-id="profile-button"]').click();
        cy.get('[data-test-id="set-preferences-button"]').click();
        cy.get('[data-test-id="delete-preferences-button"]').click();
        cy.get('[data-test-id="confirm-delete-preferences"]').click();
    });
});