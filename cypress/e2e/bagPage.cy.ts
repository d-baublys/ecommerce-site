import { CypressTestProductData } from "../../src/lib/definitions";
import { buildProductUrl } from "../../src/lib/utils";

let testProductLink: string;

describe("Bag page base tests", () => {
    beforeEach(() => {
        cy.visit("/bag");
        cy.location("pathname").should("eq", "/bag");
        cy.contains("My Bag").should("be.visible");
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

describe("Bag page populated tests", () => {
    before(() => {
        cy.task("getTestProductSavedData").then((data: CypressTestProductData) => {
            testProductLink = buildProductUrl(data.id, data.slug);
        });
    });

    beforeEach(() => {
        cy.visitTestProduct(testProductLink);
        cy.get("[aria-label='Size selection']").select("L");
        cy.contains("button", "Add to Bag").click();
        cy.get("[aria-label='Size selection']").select("XL");
        cy.contains("button", "Add to Bag").click();
        cy.contains("button", "Add to Bag").click();
        cy.visit("/bag");
        cy.location("pathname").should("eq", "/bag");
        cy.contains("My Bag").should("be.visible");
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
    });

    it("updates bag totals & bag count badge when an item quantity changes", () => {
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

    it("updates bag tile list, bag totals, & bag count badge when an item is removed", () => {
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

    it("redirects to log in page on 'checkout' button click when unauthenticated", () => {
        cy.contains("button", "Checkout").click();
        cy.location("pathname").should("eq", "/login");
        cy.location("search").should("eq", "?redirect_after=bag");
    });

    it("navigates to Stripe on 'checkout' button click when authenticated", () => {
        cy.intercept("POST", "/api/create-checkout-session").as("createCheckoutSession");

        cy.logInAsStandardUser();
        cy.visit("/bag");
        cy.location("pathname").should("eq", "/bag");
        cy.contains("My Bag").should("be.visible");
        cy.contains("button", "Checkout").click();
        cy.wait("@createCheckoutSession").its("response.statusCode").should("eq", 200);
    });

    it("automatically initiates checkout after logging in from redirect", () => {
        cy.intercept("POST", "https://m.stripe.com/6").as("stripeEntryOnRedirect");

        cy.contains("button", "Checkout").click();
        cy.location("pathname").should("eq", "/login");
        cy.location("search").should("eq", "?redirect_after=bag");
        cy.logInFromCurrent();
        cy.location("pathname").should("eq", "/bag");
        cy.location("search").should("eq", "?from_login=true");
        cy.get("[aria-label='Loading indicator']").should("not.exist");
        cy.wait("@stripeEntryOnRedirect").its("response.statusCode").should("eq", 200);
    });

    it("redirects to log in page on 'checkout' button click after logging out", () => {
        cy.intercept("POST", "/api/auth/signout").as("sign-out");
        cy.logInAsStandardUser();
        cy.visit("/bag");
        cy.location("pathname").should("eq", "/bag");
        cy.contains("My Bag").should("be.visible");
        cy.awaitPathnameSettle();
        cy.get("#navbar [aria-label='Account']").click();
        cy.contains("button", "Log Out").click();
        cy.wait("@sign-out").its("response.statusCode").should("eq", 200);
        cy.contains("button", "Checkout").click();
        cy.location("pathname").should("eq", "/login");
        cy.location("search").should("eq", "?redirect_after=bag");
    });

    it("has no accessibility violations", () => {
        cy.injectAxe();
        cy.checkA11y();
    });
});
