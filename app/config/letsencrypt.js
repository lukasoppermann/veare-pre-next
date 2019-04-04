module.exports = {
  // Let's Encrypt v2 is ACME draft 11
  version: 'draft-11',
  // staging server
  // server: 'https://acme-staging-v02.api.letsencrypt.org/directory',
  // production server
  server: 'https://acme-v02.api.letsencrypt.org/directory',
  email: 'oppermann.lukas@gmail.com',
  agreeTos: true,
  approvedDomains: [
    'lukas-oppermann.de', 'www.lukas-oppermann.de',
    'lukasoppermann.de', 'www.lukasoppermann.de',
    'lukasoppermann.com', 'www.lukasoppermann.com',
    'vea.re', 'www.vea.re',
    'veare.de', 'www.veare.de'
  ],
  // You MUST have access to write to directory where certs are saved
  // ex: /home/foouser/acme/etc
  configDir: '/home/shared/acme', // MUST have write access,
  communityMember: true
  //, debug: true
}
