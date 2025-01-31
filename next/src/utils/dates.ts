export const formatDateString = (dateString: string): Date => {
    if (!/^\d{8}$/.test(dateString)) {
      throw new Error('Invalid date format. Expected YYYYMMDD');
    }
  
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    
    const formattedDate = `${year}-${month}-${day}`;
    const date = new Date(formattedDate);
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
  
    return date;
  };

  export const formatDateToMonthDayYear = (dateString: string | undefined) => {
    if (!dateString) return '';
    
    // Create date object from ISO string
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };