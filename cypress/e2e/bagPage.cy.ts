import { CypressTestProductData } from "../../src/lib/types";
import { buildAdminProductUrl, buildProductUrl } from "../../src/lib/utils";

let testProductLink: string;
let testProductAdminLink: string;

describe("Bag page base tests", () => {
    beforeEach(() => {
        cy.visitBag();
    });

    it("shows correct message when the bag is empty", () => {
        cy.contains("Your bag is empty!").should("be.visible");
    });

    it("displays the correct bag totals by default", () => {
        cy.get("[aria-label='Bag subtotal']")
            .invoke("text")
            .and("match", /[£$€]0\.00/);

        cy.get("[aria-label='Shipping cost']").should("have.text", "-");

        cy.get("[aria-label='Bag total']")
            .invoke("text")
            .and("match", /[£$€]0\.00/);
    });

    it("doesn't render 'checkout' button when bag is empty", () => {
        cy.contains("button", "Checkout").should("not.exist");
    });
});

describe("Bag page reserved item tests", () => {
    before(() => {
        cy.task("getTestProductSavedData").then((data: CypressTestProductData) => {
            testProductLink = buildProductUrl(data.id, data.slug);
            testProductAdminLink = buildAdminProductUrl(data.id);
        });
    });

    it("reduces stock available to others on checkout initiation", () => {
        cy.createReservedItems(testProductLink);
        cy.visitTestProduct(testProductLink);
        cy.get("[aria-label='Size selection'] option").should("contain.text", "L - out of stock");
    });

    it("deletes all user checkout sessions and associated reserved items on bag page load", () => {
        cy.logInAsAdmin();
        cy.visitTestProduct(testProductLink);
        cy.get("[aria-label='Size selection'] option").should("contain.text", "L - out of stock");
        cy.visitBag();
        cy.visitTestProduct(testProductLink);
        cy.get("[aria-label='Size selection'] option").should(
            "not.contain.text",
            "L - out of stock"
        );
    });

    it("updates bag details & shows modal on page load when reserved items reduce net available stock", () => {
        const testUserBag = {};

        cy.buildTestBag(testProductLink);
        cy.window().then((win) => {
            Object.assign(testUserBag, win.localStorage);
        });
        cy.clearLocalStorage();
        cy.awaitBagUpdate();

        cy.createReservedItems(testProductLink);
        cy.clearLocalStorage();
        cy.awaitBagUpdate();
        cy.window().then((win) => {
            Object.entries(testUserBag).forEach(([k, v]) => {
                win.localStorage.setItem(k, v as string);
            });
        });
        cy.awaitBagUpdate();

        cy.visitBag();
        cy.contains(/Available stock for some of your items has changed./).should("be.visible");
        cy.get("#bag-tile-container .bag-tile").then(($bagTiles) => {
            cy.wrap($bagTiles).eq(0).as("first-tile");
            cy.wrap($bagTiles).eq(1).as("second-tile");

            cy.get("@first-tile").find("select").should("not.exist");
            cy.get("@first-tile").contains("Out of stock");
            cy.get("@second-tile").find("option:selected").should("have.text", "2");
        });

        cy.get("[aria-label='Bag subtotal']")
            .invoke("text")
            .and("match", /[£$€]420\.00/);

        cy.get("[aria-label='Shipping cost']")
            .invoke("text")
            .and("match", /[£$€]5\.00/);

        cy.get("[aria-label='Bag total']")
            .invoke("text")
            .and("match", /[£$€]425\.00/);
        cy.get(".bag-count-badge").should("have.text", "2");
    });
});

describe("Bag page populated tests", () => {
    before(() => {
        cy.resetDb();
        cy.task("getTestProductSavedData").then((data: CypressTestProductData) => {
            testProductLink = buildProductUrl(data.id, data.slug);
            testProductAdminLink = buildAdminProductUrl(data.id);
        });
    });

    beforeEach(() => {
        cy.buildTestBag(testProductLink);
        cy.visitBag();
    });

    it("correctly totals items in the bag and renders 'checkout' button", () => {
        cy.get("[aria-label='Bag subtotal']")
            .invoke("text")
            .and("match", /[£$€]630\.00/);

        cy.get("[aria-label='Shipping cost']")
            .invoke("text")
            .and("match", /[£$€]5\.00/);

        cy.get("[aria-label='Bag total']")
            .invoke("text")
            .and("match", /[£$€]635\.00/);

        cy.contains("button", "Checkout").should("be.visible");
    });

    it("displays the correct bag tile details", () => {
        cy.get("#bag-tile-container .bag-tile").then(($bagTiles) => {
            cy.get("#bag-tile-container .bag-tile").should("have.length", 2);
            cy.wrap($bagTiles).eq(0).as("first-tile");
            cy.wrap($bagTiles).eq(1).as("second-tile");

            cy.get("@first-tile")
                .invoke("text")
                .and("match", /WHITE & MEDIUM DARK PRINT/);
            cy.get("@first-tile")
                .invoke("text")
                .and("match", /Size - L/);
            cy.get("@first-tile").find("option:selected").should("have.text", "1");

            cy.get("@second-tile")
                .invoke("text")
                .and("match", /WHITE & MEDIUM DARK PRINT/);
            cy.get("@second-tile")
                .invoke("text")
                .and("match", /Size - XL/);
            cy.get("@second-tile").find("option:selected").should("have.text", "2");
        });

        cy.get(".bag-count-badge").should("have.text", "3");
    });

    it("updates bag details when an item's quantity changes", () => {
        cy.get("#bag-tile-container .bag-tile").eq(1).find("select").select("1");

        cy.get("[aria-label='Bag subtotal']")
            .invoke("text")
            .and("match", /[£$€]420\.00/);

        cy.get("[aria-label='Shipping cost']")
            .invoke("text")
            .and("match", /[£$€]5\.00/);

        cy.get("[aria-label='Bag total']")
            .invoke("text")
            .and("match", /[£$€]425\.00/);

        cy.get(".bag-count-badge").should("have.text", "2");
    });

    it("updates bag details when an item is removed", () => {
        cy.get("#bag-tile-container .bag-tile")
            .eq(1)
            .find("[aria-label='Remove from bag']")
            .click();

        cy.get("[aria-label='Bag subtotal']")
            .invoke("text")
            .and("match", /[£$€]210\.00/);

        cy.get("[aria-label='Shipping cost']")
            .invoke("text")
            .and("match", /[£$€]5\.00/);

        cy.get("[aria-label='Bag total']")
            .invoke("text")
            .and("match", /[£$€]215\.00/);

        cy.get("#bag-tile-container .bag-tile").should("have.length", 1);
        cy.get(".bag-count-badge").should("have.text", "1");
    });

    it("updates bag details & shows modal on page load when available stock is reduced", () => {
        cy.decrementTestProductStock(testProductAdminLink);
        cy.visitBag();

        cy.contains(/Available stock for some of your items has changed./).should("be.visible");

        cy.get("#bag-tile-container .bag-tile").then(($bagTiles) => {
            cy.wrap($bagTiles).eq(0).as("first-tile");
            cy.wrap($bagTiles).eq(1).as("second-tile");

            cy.get("@first-tile").find("select").should("not.exist");
            cy.get("@first-tile").contains("Out of stock");
            cy.get("@second-tile").find("option:selected").should("have.text", "1");
        });

        cy.get("[aria-label='Bag subtotal']")
            .invoke("text")
            .and("match", /[£$€]210\.00/);

        cy.get("[aria-label='Shipping cost']")
            .invoke("text")
            .and("match", /[£$€]5\.00/);

        cy.get("[aria-label='Bag total']")
            .invoke("text")
            .and("match", /[£$€]215\.00/);
        cy.get(".bag-count-badge").should("have.text", "1");
        cy.resetDb();

        cy.task("getTestProductSavedData").then((data: CypressTestProductData) => {
            testProductLink = buildProductUrl(data.id, data.slug);
            testProductAdminLink = buildAdminProductUrl(data.id);
        });
    });

    it("doesn't render checkout button if any items become unstocked", () => {
        cy.decrementTestProductStock(testProductAdminLink);
        cy.visitBag();

        cy.contains(/Available stock for some of your items has changed./).should("be.visible");
        cy.get("#close-modal-button").click();

        cy.contains("button", "Checkout").should("not.exist");
        cy.resetDb();
        cy.task("getTestProductSavedData").then((data: CypressTestProductData) => {
            testProductLink = buildProductUrl(data.id, data.slug);
            testProductAdminLink = buildAdminProductUrl(data.id);
        });
    });

    it("redirects to log in page on 'checkout' button click when unauthenticated", () => {
        cy.contains("button", "Checkout").click();
        cy.location("pathname").should("eq", "/login");
        cy.location("search").should("eq", "?redirect_after=bag");
    });

    it("initiates checkout on 'checkout' button click when authenticated", () => {
        cy.intercept("POST", "/api/create-checkout-session").as("create-checkout-session");

        cy.logInAsStandardUser();
        cy.visitBag();
        cy.contains("button", "Checkout").click();
        cy.wait("@create-checkout-session").its("response.statusCode").should("eq", 200);
        cy.resetUserCheckouts();
    });

    it("automatically initiates checkout after logging in from redirect", () => {
        cy.intercept("POST", "/api/create-checkout-session").as("create-checkout-session");

        cy.contains("button", "Checkout").click();
        cy.location("pathname").should("eq", "/login");
        cy.location("search").should("eq", "?redirect_after=bag");
        cy.logInFromCurrent();
        cy.location("pathname").should("eq", "/bag");
        cy.location("search").should("eq", "?from_login=true");
        cy.get("#loading-indicator").should("not.exist");
        cy.wait("@create-checkout-session").its("response.statusCode").should("eq", 200);
        cy.resetUserCheckouts();
    });

    it("redirects to log in page on 'checkout' button click after logging out", () => {
        cy.intercept({ method: "POST", url: /https:\/\/m\.stripe\.com/ }).as("stripe-init");

        cy.logInAsStandardUser();
        cy.visitBag();
        cy.logOut();
        cy.wait("@stripe-init").its("response.statusCode").should("eq", 200);
        cy.contains("button", "Checkout").should("be.visible").click();
        cy.location("pathname").should("eq", "/login");
        cy.location("search").should("eq", "?redirect_after=bag");
    });

    it("has no accessibility violations", () => {
        cy.injectAxe();
        cy.checkA11y();
    });
});
