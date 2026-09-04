const DEFAULT_RATES = {
  small_business: 15,
  payday: 15,
  collateral: 15,
};

export function calculateLoanPayment(amount, duration, loanType = 'small_business', interestRate) {
  const principal = parseFloat(amount);
  const months = parseInt(duration, 10);
  const rate = interestRate ?? DEFAULT_RATES[loanType] ?? 15;

  const monthlyInterestRate = rate / 100 / 12;
  const factor = Math.pow(1 + monthlyInterestRate, months);
  const monthlyPayment =
    monthlyInterestRate === 0
      ? principal / months
      : (principal * monthlyInterestRate * factor) / (factor - 1);

  const totalPayment = monthlyPayment * months;

  return {
    loanAmount: principal,
    loanDuration: months,
    interestRate: rate,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round((totalPayment - principal) * 100) / 100,
  };
}
