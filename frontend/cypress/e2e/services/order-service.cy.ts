describe('Service Order Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input#username').type('user');
    cy.get('input#password').type('password');
    cy.get('[data-cy="login-button"]').click();
    cy.wait(100);
    });

  it('should display available services as cards', () => {

    cy.contains('Room cleaning').should('be.visible');
    cy.contains('Laundry').should('be.visible');
    cy.contains('Spa access').should('be.visible');
    
    cy.contains('10.00$').should('be.visible');
    cy.contains('11.90$').should('be.visible');
    cy.contains('42.50$').should('be.visible');
    
    cy.contains('105 min').should('be.visible');
    cy.contains('60 min').should('be.visible');
    cy.contains('120 min').should('be.visible');
  });

  it('should display star ratings for services', () => {
    cy.contains('Room cleaning')
      .closest('.MuiCard-root')
      .within(() => {
        cy.get('[data-cy="rating"]').should('exist');
      });
  });

  it('should navigate to booking page when clicking "Book Now"', () => {
    cy.contains('Room cleaning')
      .closest('.MuiCard-root')
      .within(() => {
        cy.get('[data-cy="bookButton"]').click();
      });

    cy.url().should('include', '/service-schedule/');
  });

  it('should be able to order a service', () => {
    cy.contains('Room cleaning')
      .closest('.MuiCard-root')
      .within(() => {
        cy.get('[data-cy="bookButton"]').click();
      });

      cy.get('[data-cy="employeeList"]').click();
      cy.get('.MuiMenuItem-root').first().click();

    cy.get('[data-cy="addToCart"]').should('be.visible')
  });
});