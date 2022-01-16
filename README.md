# A PassportJS SAML 2.0 POC

## Quick Start
• Configure your SP /login enpoint in your IdP
• Provide the environment variables for your IdP and run the SP app as shown below (OneLogin used in this example)
```
export SAML2_ISSUER='https://app.onelogin.com/saml/metadata/46......-d0..-49..-99..-7b..........' && \
export SAML2_SSO_ENTRYPOINT='https:/my-app.onelogin.com/trust/saml2/http-post/sso/46......-d0..-49..-99..-7b..........' && \
export SAML2_CERT='MII....................................................................................FKA==' && \
node index.js
```
• Go to an incognito window to make sure you always go through the full SAML 2.0 scenario: Hit your publicly available app url (use ngrok to expose a local running server) Since in incognito window there will be no current session, the user will not be authenticated and will be redirected to the IdP login form. Once authenticated the IdP redirects the user back to /login where passport saml 2.0 implementation will assert that the user is indeed authenticated using the SAML issuer, SSO endpoint and certificates provided in environment vars. Finally when confirmed it will show a message comming from index.html to the user. Here is the console output for that user journey:
```
app listening on port 3000
Not authenticated
{"issuer":"https://app.onelogin.com/saml/metadata/46......-d0..-49..-99..-7b..........","sessionIndex":"_871052f2-4b45-4981-b08c-493d031e8cf1","nameID":"nestor.urquiza@gmail.com","nameIDFormat":"urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress","email":"nestor.urquiza@gmail.com"}
Authenticated
```

## Setup
1. In your IdP (OneLogin offers free accounts to test this) create an app of type SAML. This is the Identity Provider (IdP).
2. install ngrok locally and point to your application.
```
./ngrok http localhost:3000
```
3. Run your application as explained in the Quick Start section. The app uses PassportJS with a SAML 2.0 Strategy to provide authentication via the IdP. This PassportJS related code is what is called the Service Provider (SP).
4. Point the IdP ACS (Consumer) URL Validator and ACS (Consumer) URL to the same /login endpoint or your app (which contains the SP code), for example:
```
http://d529-72-28-211-41.ngrok.io/login
```
5. Setup the IdP with "SAML initiator = Service Provider"
6. Setup the IdP to provide the "email" parameter in the SAML payload sent to the SP.
7. Create a user with same email in the IdP and in the SP
8. Access the app as explained in the Quick Start section
