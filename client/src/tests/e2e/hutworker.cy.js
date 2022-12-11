/* eslint-disable no-undef */
/// <reference types="cypress" />
const { UserType } = require("../../helper/enums");

describe("Hut Worker Operations", () => {

    it("Registration of Hut Worker without Huts Selected", () => {
        cy.visit("http://localhost:3000/sign-in");
        cy.get('[data-test-id="email"]').type("test_hut_worker1@gmail.com");
        cy.get('[data-test-id="password"').type("password");
        cy.get('[data-test-id="confirmPass"').type("password");
        cy.get('[data-test-id="fullName"]').type("test");
        cy.get('[data-test-id="userType"]').select(UserType.HUT_WORKER)
        

        cy.contains("Select the hut").should("be.visible")
        cy.contains("Select the hut").click()

        cy.contains("Save").click()

        cy.get('[data-test-id="sign-in"]').click()
        cy.get('Go to homepage').should('not.exist');

    });

    it("Registration of Hut Worker with Huts Selected", () => {
        cy.visit("http://localhost:3000/sign-in");
        cy.get('[data-test-id="email"]').type("test_hut_worker2@gmail.com");
        cy.get('[data-test-id="password"').type("password");
        cy.get('[data-test-id="confirmPass"').type("password");
        cy.get('[data-test-id="fullName"]').type("test");
        cy.get('[data-test-id="userType"]').select(UserType.HUT_WORKER)
        

        cy.contains("Select the hut").should("be.visible")
        cy.contains("Select the hut").click()

        cy.contains('Hut2').click()
        cy.contains("Save").click()

        cy.get('[data-test-id="sign-in"]').click()
        cy.contains('Go to homepage').click()
        
    });

    it("Login as Hut Worker", () => {
        cy.visit("http://localhost:3000/login");
        cy.get('[data-test-id="email"]').type("martacorci1@test.it");
        cy.get('[data-test-id="password"').type("password");
        cy.get("button").click();
    });

    it("Try to Update a Location", () => {
        cy.visit("http://localhost:3000/login");
        cy.get('[data-test-id="email"]').type("martacorci1@test.it");
        cy.get('[data-test-id="password"').type("password");
        cy.get("button").click();

        cy.contains('test').click()
        cy.contains('Profile').click()

        cy.contains('Update').click()
        cy.get('[data-test-id="descriptionHut"').clear()
        cy.get('[data-test-id="descriptionHut"').type("New Description for the hut");
        cy.contains("Save").click()
    });

    it("Try to Select Remove from Update of Location", () => {
        cy.visit("http://localhost:3000/login");
        cy.get('[data-test-id="email"]').type("martacorci1@test.it");
        cy.get('[data-test-id="password"').type("password");
        cy.get("button").click();

        cy.contains('test').click()
        cy.contains('Profile').click()

        cy.contains('Update').click()
        cy.get('[data-test-id="descriptionHut"').clear()
        cy.get('[data-test-id="descriptionHut"').type("New Description for the hut");
        cy.contains("Close").click()
    });

})