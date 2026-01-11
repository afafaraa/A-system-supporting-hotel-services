describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input#username').type('user');
    cy.get('input#password').type('password');
    cy.get('[data-cy="login-button"]').click();
    cy.wait(100);
  });

  it('should navigate between main tabs/pages', () => {
    const tabs = [
      { name: 'Dostępne usługi', url: '/guest/available' },
      { name: 'Zamówione usługi', url: '/guest/booked' },
      { name: 'Zarezerwuj pokój', url: '/guest/hotel' },
    ];

    tabs.forEach((tab) => {
      cy.get(`[data-cy="${tab.name}"]`).click();
      
      cy.url().should('include', tab.url);
    });
  });

  it('should highlight active navigation item', () => {
    cy.get('[data-cy="Zamówione usługi"]').click();
    cy.get('[data-cy="Zamówione usługi"]')
      .should('have.class','css-1um7fo9');
  });

  it('should navigate to settings page', () => {
    cy.get('[data-cy="userCard"]').click();
    
    cy.url().should('include', '/profile');
  });

  it('should prevent navigation to protected routes without authentication', () => {
    cy.get('[data-cy="logoutButton"]').click()
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.visit('/guest/hotel');
    
    cy.url().should('include', '/login');

    cy.visit('/guest/booked');
    cy.url().should('include', '/login');
  });
});