describe("Home page", () => {
    beforeEach(() => {
        cy.visitHome();
    });

    it("renders the hero section correctly", () => {
        cy.get("h1").should("contain.text", "Summer 2025 styles here and now.");
        cy.contains("a", "Shop >>>").click();
        cy.location("pathname").should("eq", "/category/all");
        cy.get("[aria-label='Loading indicator']").should("not.exist");
    });

    it("rotates product carousel correctly", () => {
        cy.get("#carousel-slider").then(($slider) => {
            const sliderBounds = $slider[0].getBoundingClientRect();

            cy.get("#featured-1").then(($firstProd) => {
                const firstProdBounds = $firstProd[0].getBoundingClientRect();

                expect(firstProdBounds.left).to.be.at.least(sliderBounds.left);
                expect(firstProdBounds.right).to.be.at.most(sliderBounds.right);
            });
        });
        cy.get("#carousel-nav-forward").click();
        cy.wait(500);
        cy.get("#carousel-slider").then(($slider) => {
            const sliderBounds = $slider[0].getBoundingClientRect();

            cy.get("#featured-2").then(($secondProd) => {
                const secondProdBounds = $secondProd[0].getBoundingClientRect();

                expect(secondProdBounds.left).to.be.at.least(sliderBounds.left);
                expect(secondProdBounds.right).to.be.at.most(sliderBounds.right);
            });
        });
    });
});
