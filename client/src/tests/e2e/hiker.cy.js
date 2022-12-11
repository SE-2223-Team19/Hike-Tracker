/* eslint-disable no-undef */
/// <reference types="cypress" />
const { UserType } = require("../../helper/enums");

describe("Hiker Operations", () => {

    it("Registration of Hiker User", () => {
        cy.visit("http://localhost:3000/sign-in");
        cy.get('[data-test-id="email"]').type("test_hiker@gmail.com");
        cy.get('[data-test-id="password"').type("password");
        cy.get('[data-test-id="confirmPass"').type("password");
        cy.get('[data-test-id="fullName"]').type("test");
        cy.get('[data-test-id="userType"]').select(UserType.HIKER)
        cy.get('[data-test-id="sign-in"]').click()
    });

    it("logs in as a hiker failed", () => {
        cy.visit("http://localhost:3000/login");
        cy.get('[data-test-id="email"]').type("test_hiker@gmail.com");
        cy.get('[data-test-id="password"').type("password");
        cy.get("button").click();
    });

    it("login available hiker", () => {
        cy.visit("http://localhost:3000/login");
        cy.get('[data-test-id="email"]').type("vittorioarpino@test.it");
        cy.get('[data-test-id="password"').type("password");
        cy.get("button").click();
    });

    it("Search Operations of hiker",  () => {
        cy.visit("http://localhost:3000/login");
        cy.get('[data-test-id="email"]').type("vittorioarpino@test.it");
        cy.get('[data-test-id="password"').type("password");
        cy.get("button").click();

        cy.contains("Filters").click()
        cy.contains("Select area").click()
        cy.contains("Ok").click()

        cy.contains("Filters").click()
        cy.contains("Filters").click()

        cy.contains("Select area").click()
        cy.contains("Remove").click()

    })
    
    

}) 

