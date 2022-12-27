/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Login as a local guide", () => {
	it("goes to website", () => {
		cy.visit("http://localhost:3000");
	});

	it("logs in as a local guide", () => {
		cy.visit("http://localhost:3000/login");
		cy.get('[data-test-id="email"]').type("test_localGuide@test.it");
		cy.get('[data-test-id="password"').type("password");
		cy.get("button").click();
	});


});
