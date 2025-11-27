describe('Login Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/login');
  });

  it('should display login form with all elements', () => {
    cy.get('svg').should('be.visible');
    
    cy.get('input#username').should('be.visible');
    cy.get('input#password').should('be.visible');

    cy.contains('a', /reset password|resetuj hasło/i).should('be.visible');
    cy.contains('a', /Register today|Zarejestruj się już dziś/i).should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.intercept('POST', '**/open/token', {
      statusCode: 401,
      body: {
        message: 'Invalid credentials',
      },
    }).as('loginRequest');

    cy.get('input#username').type('wronguser');
    cy.get('input#password').type('wrongpassword');
    cy.get('[data-cy="login-button"]').click();

    cy.wait('@loginRequest');

    cy.contains(/invalid credentials|nieprawidłowe dane/i).should('be.visible');
  });

  it('should show error for unverified email', () => {
    cy.intercept('POST', '**/open/token', {
      statusCode: 403,
      body: {
        message: 'Email not verified',
      },
    }).as('loginRequest');

    cy.get('input#username').type('unverified@example.com');
    cy.get('input#password').type('password123');
    cy.get('[data-cy="login-button"]').click();

    cy.wait('@loginRequest');

    cy.contains(/email not verified|email nie został zweryfikowany/i).should('be.visible');
  });

  it('should show error for network issues', () => {
    cy.intercept('POST', '**/open/token', {
      forceNetworkError: true,
    }).as('loginRequest');

    cy.get('input#username').type('user');
    cy.get('input#password').type('password');
    cy.get('[data-cy="login-button"]').click();

    cy.wait('@loginRequest');

    cy.contains(/network error|Błąd połączenia z serwerem/i).should('be.visible');
  });

  it('should show error for server errors (500+)', () => {
    cy.intercept('POST', '**/open/token', {
      statusCode: 500,
      body: {
        message: 'Internal server error',
      },
    }).as('loginRequest');

    cy.get('input#username').type('user');
    cy.get('input#password').type('password');
    cy.get('[data-cy="login-button"]').click();

    cy.wait('@loginRequest');

    cy.contains(/server error|błąd serwera/i).should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    cy.intercept('POST', '**/open/token', {
      statusCode: 200,
      body: {
        password: "password",
        username: "user"
      },
    }).as('loginRequest');

    cy.intercept('GET', '**/api/user/**', {
      statusCode: 200,
      body: {
        id: '1',
        username: 'user',
        email: 'user@example.com',
        role: 'GUEST',
        active: true,
      },
    }).as('getUserDetails');

    cy.get('input#username').type('user');
    cy.get('input#password').type('password');
    cy.get('[data-cy="login-button"]').click();

    cy.wait('@loginRequest');
  });

  it('should toggle password visibility', () => {
    cy.get('input#password').should('have.attr', 'type', 'password');
    
    cy.get('input#password')
      .parent()
      .find('button[aria-label*="password"], button[type="button"]')
      .first()
      .click();
    
    cy.get('input#password').should('have.attr', 'type', 'text');
    
    cy.get('input#password')
      .parent()
      .find('button[aria-label*="password"], button[type="button"]')
      .first()
      .click();
    
    cy.get('input#password').should('have.attr', 'type', 'password');
  });

  it('should navigate to registration page', () => {
    cy.contains('a', /Register today|Zarejestruj się już dziś/i).click();
    
    cy.url().should('include', '/register');
  });

  it('should navigate to reset password page', () => {
    cy.contains('a', /reset password|resetuj hasło/i).click();
    
    cy.url().should('include', '/reset-password');
  });

  it('should disable submit button when fields are empty', () => {
    cy.get('[data-cy="login-button"]').should('be.disabled');
    
    cy.get('input#username').type('user');
    cy.get('[data-cy="login-button"]').should('be.disabled');
    
    cy.get('input#username').clear();
    cy.get('input#password').type('password');
    cy.get('[data-cy="login-button"]').should('be.disabled');
    
    cy.get('input#username').type('user');
    cy.get('[data-cy="login-button"]').should('not.be.disabled');
  });

  it('should show loading state during login', () => {
    cy.intercept('POST', '**/open/token', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          accessToken: 'fake-access-token',
          refreshToken: 'fake-refresh-token',
        },
        delay: 1000,
      });
    }).as('loginRequest');

    cy.get('input#username').type('user');
    cy.get('input#password').type('password');
    cy.get('[data-cy="login-button"]').click();

    cy.contains('button[type="submit"]', /sign in|log in|zaloguj/i)
      .should('have.attr', 'disabled');
  });

  it('should auto-hide error message after 10 seconds', () => {
    cy.intercept('POST', '**/open/token', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('loginRequest');

    cy.get('input#username').type('wronguser');
    cy.get('input#password').type('wrongpassword');
    cy.get('[data-cy="login-button"]').click();
    cy.wait('@loginRequest');

    cy.contains(/invalid credentials|nieprawidłowe dane/i).should('be.visible');

    cy.wait(10000);
    cy.contains(/invalid credentials|nieprawidłowe dane/i).should('not.exist');
  });
});