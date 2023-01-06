/* eslint-disable no-undef */
/// <reference types="cypress" />
const { UserType } = require("../../helper/enums");

describe("Local Guide Operations", () => {

    
    it("Login as Local Guide", () => {
        cy.visit("http://localhost:3000/login");
        cy.get('[data-test-id="email"]').type("martacorci1@test.it");
        cy.get('[data-test-id="password"').type("password");
        cy.get("button").click();
    });

    it("Registration of Local Guide", () => {
        cy.visit("http://localhost:3000/sign-in");
        cy.get('[data-test-id="email"]').type("test_hut_worker1@gmail.com");
        cy.get('[data-test-id="password"').type("password");
        cy.get('[data-test-id="confirmPass"').type("password");
        cy.get('[data-test-id="fullName"]').type("test");
        cy.get('[data-test-id="phone"]').type("number");
        cy.get('[data-test-id="website"]').type("text");
        cy.get('[data-test-id="userType"]').select(UserType.LOCAL_GUIDE)
        cy.contains("Save").click()

        cy.get('[data-test-id="sign-in"]').click()
        cy.get('Go to homepage').should('not.exist');

    });
   

   
})