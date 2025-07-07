describe("Home page", () => {
    it("should rotate product carousel correctly", () => {
        cy.visit("/");

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
