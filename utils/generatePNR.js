function generatePNR() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let pnr = '';

  for (let i = 0; i < 6; i++) {
    pnr += chars[Math.floor(Math.random() * chars.length)];
  }

  return pnr;
}

module.exports = generatePNR;
