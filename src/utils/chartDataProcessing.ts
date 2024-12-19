interface Comic {
  estimated_value: number;
  added_at: string;
}

export interface MonthlyValue {
  month: string;
  value: number;
}

export const processComicData = (comics: Comic[]): MonthlyValue[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyTotals = new Map<string, number>();
  const currentYear = new Date().getFullYear();
  
  // Initialize all months with 0
  months.forEach(month => {
    monthlyTotals.set(month, 0);
  });

  // Calculate running total for each month
  let runningTotal = 0;
  comics?.forEach(comic => {
    if (comic.estimated_value) {
      const date = new Date(comic.added_at);
      // Only process comics from the current year
      if (date.getFullYear() === currentYear) {
        const month = months[date.getMonth()];
        runningTotal += Number(comic.estimated_value);
        monthlyTotals.set(month, runningTotal);
      }
    }
  });

  // Convert to array format for Recharts
  return months.map(month => ({
    month,
    value: monthlyTotals.get(month) || 0
  }));
};