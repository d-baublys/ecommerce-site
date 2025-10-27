import { TestOrderCypressParams } from "../../../src/lib/test-factories";
import { CypressTestDataDeleteParams, CypressTestProductData, Order } from "../../../src/lib/types";

let orderIds: CypressTestDataDeleteParams["orderIds"] = [];
let productIds: CypressTestDataDeleteParams["productIds"] = [];

describe("Admin orders page base tests", () => {
    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visit("/admin/orders");
        cy.location("pathname").should("eq", "/admin/orders");
        cy.contains("Orders").should("be.visible");
    });

    it("shows fallback message when there is no order data", () => {
        cy.contains("No orders to show").should("be.visible");
    });
});

describe("Admin orders page seeded tests", () => {
    before(() => {
        cy.task("createCypressTestProduct").then((productData: CypressTestProductData) => {
            productIds.push(productData.id);

            const quantityMap: TestOrderCypressParams["quantityMap"][] = [[1], [2], [3]];
            const statusMap: NonNullable<TestOrderCypressParams["overrides"]>["status"][] = [
                "paid",
                "refunded",
                "pendingReturn",
            ];
            const createdAtMap: NonNullable<TestOrderCypressParams["overrides"]>["createdAt"][] = [
                new Date("2025-08-03"),
                new Date("2025-08-01"),
                new Date("2025-08-02"),
            ];

            const returnRequestedAtMap: NonNullable<
                TestOrderCypressParams["overrides"]
            >["returnRequestedAt"][] = [null, new Date("2025-08-15"), new Date("2025-08-10")];

            const refundedAtMap: NonNullable<TestOrderCypressParams["overrides"]>["refundedAt"][] =
                [null, new Date("2025-08-20"), null];

            Array.from({ length: 3 }).forEach((_, idx) => {
                const params: TestOrderCypressParams = {
                    idx,
                    testProductsData: [productData],
                    quantityMap: quantityMap[idx],
                    overrides: {
                        status: statusMap[idx],
                        createdAt: createdAtMap[idx],
                        returnRequestedAt: returnRequestedAtMap[idx],
                        refundedAt: refundedAtMap[idx],
                    },
                };
                cy.task("createCypressTestOrder", params).then((orderId: Order["id"]) => {
                    orderIds.push(orderId);
                });
            });
        });
    });

    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visit("/admin/orders");
        cy.location("pathname").should("eq", "/admin/orders");
        cy.contains("Orders").should("be.visible");
    });

    after(() => {
        if (orderIds.length || productIds.length) {
            cy.task("deleteTestData", {
                orderIds,
                productIds,
            });
        }
    });

    it("renders correct number of table rows", () => {
        cy.contains("No orders to show!").should("not.exist");
        cy.get("#orders-table tbody tr").should("have.length", 3);
    });

    it("sorts by descending 'return requested' date by default", () => {
        cy.get("tbody tr").eq(0).find("td").eq(7).should("have.text", "2025-08-15");
        cy.get("tbody tr").eq(1).find("td").eq(7).should("have.text", "2025-08-10");
        cy.get("tbody tr").eq(2).find("td").eq(7).should("have.text", "");
    });

    it("alternates between descending and ascending order on same column sort click", () => {
        cy.contains("th", "Order #").find("button").click();
        cy.get("tbody tr").eq(0).find("td").first().should("have.text", "3");
        cy.get("tbody tr").eq(1).find("td").first().should("have.text", "2");
        cy.get("tbody tr").eq(2).find("td").first().should("have.text", "1");

        cy.contains("th", "Order #").find("button").click();
        cy.get("tbody tr").eq(0).find("td").first().should("have.text", "1");
        cy.get("tbody tr").eq(1).find("td").first().should("have.text", "2");
        cy.get("tbody tr").eq(2).find("td").first().should("have.text", "3");

        cy.contains("th", "Order #").find("button").click();
        cy.get("tbody tr").eq(0).find("td").first().should("have.text", "3");
        cy.get("tbody tr").eq(1).find("td").first().should("have.text", "2");
        cy.get("tbody tr").eq(2).find("td").first().should("have.text", "1");
    });

    it("executes date-based sorts correctly", () => {
        cy.get("tbody tr").eq(0).find("td").eq(7).should("have.text", "2025-08-15");
        cy.get("tbody tr").eq(1).find("td").eq(7).should("have.text", "2025-08-10");
        cy.get("tbody tr").eq(2).find("td").eq(7).should("have.text", "");

        cy.contains("th", "Date Return Requested").find("button").click();
        cy.get("tbody tr").eq(0).find("td").eq(7).should("have.text", "");
        cy.get("tbody tr").eq(1).find("td").eq(7).should("have.text", "2025-08-10");
        cy.get("tbody tr").eq(2).find("td").eq(7).should("have.text", "2025-08-15");
    });

    it("defaults to descending order on sort column change", () => {
        cy.contains("th", "Order #").find("button").click();
        cy.get("tbody tr").eq(0).find("td").first().should("have.text", "3");
        cy.get("tbody tr").eq(1).find("td").first().should("have.text", "2");
        cy.get("tbody tr").eq(2).find("td").first().should("have.text", "1");

        cy.contains("th", "Order #").find("button").click();
        cy.get("tbody tr").eq(0).find("td").first().should("have.text", "1");
        cy.get("tbody tr").eq(1).find("td").first().should("have.text", "2");
        cy.get("tbody tr").eq(2).find("td").first().should("have.text", "3");

        cy.contains("th", "Date Created").find("button").click();
        cy.get("tbody tr").eq(0).find("td").eq(6).should("have.text", "2025-08-03");
        cy.get("tbody tr").eq(1).find("td").eq(6).should("have.text", "2025-08-02");
        cy.get("tbody tr").eq(2).find("td").eq(6).should("have.text", "2025-08-01");
    });

    it("executes currency-based sorts correctly", () => {
        cy.contains("th", "Subtotal").find("button").click();
        cy.get("tbody tr").eq(0).find("td").eq(3).should("have.text", "£75.00");
        cy.get("tbody tr").eq(1).find("td").eq(3).should("have.text", "£50.00");
        cy.get("tbody tr").eq(2).find("td").eq(3).should("have.text", "£25.00");

        cy.contains("th", "Subtotal").find("button").click();
        cy.get("tbody tr").eq(0).find("td").eq(3).should("have.text", "£25.00");
        cy.get("tbody tr").eq(1).find("td").eq(3).should("have.text", "£50.00");
        cy.get("tbody tr").eq(2).find("td").eq(3).should("have.text", "£75.00");
    });

    it("executes text-based sorts correctly", () => {
        cy.contains("th", "Status").find("button").click();
        cy.get("tbody tr").eq(0).find("td").last().should("have.text", "Refunded");
        cy.get("tbody tr").eq(1).find("td").last().should("contain.text", "Pending Return");
        cy.get("tbody tr").eq(2).find("td").last().should("have.text", "Paid");

        cy.contains("th", "Status").find("button").click();
        cy.get("tbody tr").eq(0).find("td").last().should("have.text", "Paid");
        cy.get("tbody tr").eq(1).find("td").last().should("contain.text", "Pending Return");
        cy.get("tbody tr").eq(2).find("td").last().should("have.text", "Refunded");
    });

    it("renders an 'approve refund' button for 'pending return' orders ", () => {
        cy.get("tbody tr")
            .eq(1)
            .find("td")
            .last()
            .contains("button", "Approve Refund")
            .should("be.visible");
    });

    it("shows confirm modal on 'approve refund' click", () => {
        cy.contains("button", "Approve Refund").click();
        cy.contains("Are you sure you want to approve this refund?");
    });

    it("navigates to individual admin order page on anchor link click", () => {
        cy.awaitTableSettle();
        cy.get("tbody a").first().click();
        cy.location("pathname").should("eq", `/admin/orders/${orderIds[1]}`);
        cy.contains("p", "TEST PRODUCT 1").should("be.visible");
    });
});
