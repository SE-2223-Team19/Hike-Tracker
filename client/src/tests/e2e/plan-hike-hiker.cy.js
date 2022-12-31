/* eslint-disable no-undef */
/// <reference types="cypress" />
const { UserType } = require("../../helper/enums");

describe("Hiker plan hike", () => {

    it("Start a hike", () => {
        cy.visit("http://localhost:3000/login");
        cy.get('[data-test-id="email"]').type("test_Hiker@test.it");
        cy.get('[data-test-id="password"').type("password");
        cy.get("button").click();
        cy.contains("Start").click();
    })

    it("Stop a hike", () => {
        cy.visit("http://localhost:3000/login");
        cy.get('[data-test-id="email"]').type("test_Hiker@test.it");
        cy.get('[data-test-id="password"').type("password");
        cy.get("button").click();
        cy.get('[data-test-id="user-dropdown"]').click();
        cy.get('[data-test-id="profile-button"]').click();
        cy.get('[id="controlled-tab-example-tab-active hikes"]').click();
        cy.contains("Stop").click();
    })

    it("Start a planned hike", () => {
        cy.visit("http://localhost:3000/login");
        cy.get('[data-test-id="email"]').type("test_Hiker@test.it");
        cy.get('[data-test-id="password"').type("password");
        cy.get("button").click();
        cy.contains("Plan").click();
        cy.get('[data-test-id="user-dropdown"]').click();
        cy.get('[data-test-id="profile-button"]').click();
        cy.get('[id="controlled-tab-example-tab-planned hikes"]').click();
        cy.contains("Start").click();
    })

})