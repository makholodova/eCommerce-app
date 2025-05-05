describe("Главная страница", () => {
  it("открывается и отображает заголовок", () => {
    cy.visit("http://localhost:5173");
    cy.contains("h1", "Vite + Vue");
  });
});
