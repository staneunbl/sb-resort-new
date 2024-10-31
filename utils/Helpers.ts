import { useBookingStore } from "@/store/useBookingStore";
import { MainOptions, RoomRate } from "@/types";
import { format } from "date-fns";

export function capitalizeFirstLetter(word: string) {
  if (!word) return "NaS";
  return word.charAt(0).toUpperCase() + word.slice(1);
}
export function generateYearsArray(startYear: number, endYear: number) {
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
    return { label: startYear + index, value: startYear + index };
  }) as unknown as MainOptions[];
}

export function dynamicColumnDates(addDate: number) {
  const dates = format(
    new Date().setDate(new Date().getDate() + addDate),
    "yyyy-MM-dd",
  );
}
export function isEmptyObj(obj: object) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
export function commafy(value: number | string): string | null {
  let num: number;

  if (typeof value === 'number') {
    num = value;
  } else if (typeof value === 'string' && !isNaN(Number(value))) {
    num = parseFloat(value);
  } else {
    return null;
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function calculateInitialBill<Number>(
  reservationDate: Date,
  roomCount: number,
  weekdayRoomRate: number,
  weekendRoomRate: number,
  extraAdultCount: number,
  weekdayAdultRate: number,
  weekendAdultRate: number,
  extraChildCount: number,
  weekdayChildRate: number,
  weekendChildRate: number,
) {
  const day = reservationDate.getDay();
  const isWeekend = day >= 5;
  const roomRate = isWeekend ? weekendRoomRate : weekdayRoomRate;
  const adultRate = isWeekend ? weekendAdultRate : weekdayAdultRate;
  const childRate = isWeekend ? weekendChildRate : weekdayChildRate;

  return (
    roomCount * roomRate +
    extraAdultCount * adultRate +
    extraChildCount * childRate
  );
}

export function calculateFinalBill(
  checkIn: Date,
  checkOut: Date,
  roomCount: number,
  weekdayRoomRate: number,
  weekendRoomRate: number,
  extraAdultCount: number,
  weekdayAdultRate: number,
  weekendAdultRate: number,
  extraChildCount: number,
  weekdayChildRate: number,
  weekendChildRate: number,
  addOnTotal: number
): number {


  console.log(addOnTotal)
  const { weekdays, weekends } = findWeekdaysInRange(checkIn, checkOut);
  
  const baseRate = (weekdays * weekdayRoomRate) + (weekends * weekendRoomRate);
  const extraAdultRate = (weekdays * extraAdultCount * weekdayAdultRate) + (weekends * extraAdultCount * weekendAdultRate);
  const extraChildRate = (weekdays * extraChildCount * weekdayChildRate) + (weekends * extraChildCount * weekendChildRate);

  return baseRate + extraAdultRate + extraChildRate + addOnTotal
}

export function dateAnalysis(startDate: Date, endDate: Date) {
  // Convert string dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setDate(start.getDate() + 1);
  // Initialize counters and arrays
  let totalDays = 0;
  let weekends = [];
  let weekdays = [];

  // Loop through each date in the range
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    totalDays++;
    const dayOfWeek = d.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday

    if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) { // Friday, Saturday, Sunday
      weekends.push(d.toISOString().split('T')[0]);
    } else {
      weekdays.push(d.toISOString().split('T')[0]);
    }
  }

  // Return the results
  return {
    totalDays: totalDays,
    weekendDays: weekends.length,
    weekdayDays: weekdays.length,
    weekends: weekends,
    weekdays: weekdays
  };
}

export function formatCurrencyJP(value: number) {
  if(!value) return '0.00'
  return value.toLocaleString('ja-JP', {
    minimumFractionDigits: 2
  })
}

export function truncate(str: string, n: number) {
  return str.length > n ? str.substring(0, n - 3) + "..." : str;
}

export function findWeekdaysInRange(startDate: Date, endDate: Date) {
  const weekdays: Date[] = [];
  const weekends: Date[] = [];

  let currDate = new Date(startDate);
  endDate = new Date(endDate);
  while(currDate <   endDate) {
    if(currDate.getDay() !== 0 && currDate.getDay() !== 6) {
      weekdays.push(currDate);
    } else {
      weekends.push(currDate);
    }
    currDate.setDate(currDate.getDate() + 1);
  }
  
  return {
    weekdays: weekdays.length,
    weekends: weekends.length
  }
}

export function computeInitialBooking(rates: RoomRate, weekends: number, weekdays: number, extraAdult: number, extraChildren: number): number {

  const result = (weekdays * rates?.BaseRoomRate) + 
                  (weekends * rates?.WeekendRoomRate) + 
                  ((extraAdult * rates?.ExtraAdultRate) * weekdays) +
                  ((extraAdult * rates?.WeekendExtraAdultRate) * weekends) + 
                  ((extraChildren * rates?.ExtraChildRate) * weekdays) +
                  ((extraChildren * rates?.WeekendExtraAdultRate) * weekends);
  return result
        }


export function generateReferenceNumber(): string {
    const today = new Date()
    const year = today.getFullYear().toString()
    const month = (today.getMonth()+1).toLocaleString().padStart(2, '0')
    const day = today.getDate().toLocaleString().padStart(2, '0')  

    const characters = '0123456789';
    let result = '';

    for (let i = 0; i <= 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return `${year}${month}${day}${result}`;
}

function toCSV(data: any[], currencyColumns: string[] = []): string[] {
  const csvData = []

  const headers = Object.keys(data[0])
  const formatter = (header: string) => {
    return header.replace(/([A-Z])/g, ' $1').trim()
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "PHP",
    });
  };

  const formattedHeaders = headers.map(formatter)

  csvData.push(formattedHeaders.join(','))

  data.forEach((row) => {
    const values = headers.map((header) => row[header])
    console.log("values ", values)
    csvData.push(values.join(','))
  })

  console.log(csvData.join('\n'))
  return csvData
}

export function exportCSV(data: any[], fileName: string = 'report.csv', currencyColumns: string[] = []) {

  if(!data || data.length === 0) {
    return
  }
  
  const csvData = toCSV(data, currencyColumns)

  const blob = new Blob([csvData.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('hidden', '')
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link);
  URL.revokeObjectURL(url)
  
}

interface PrintCSVOptions {
  filename: string,
  title: string, 
  companyName: string,
  currencyColumns?: string[]
}

export function printCSV(data: any[], {filename, title, companyName, currencyColumns = []}: PrintCSVOptions) {  
  if(!data || data.length === 0) {
    return
  }

  const headers = Object.keys(data[0])
  const formatter = (header: string) => {
    return header.replace(/([A-Z])/g, ' $1').trim()
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "PHP",
    });
  };

  const formattedHeaders = headers.map(formatter)

  const csvData = toCSV(data).join('\n')
  console.log(csvData)

  let tableHTML = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            @media print {
              @page {
                size: landscape
              }
            }
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>

          <h2>${title}</h2>
          <table>
            <thead>
              <tr>
                ${formattedHeaders.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${headers.map(header => {
                    let value = row[header];
    
                    // Apply currency formatting if the column is in currencyColumns
                    if (currencyColumns.includes(header)) {
                      value = formatCurrency(Number(value));
                    }
    
                    return `<td>${value}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <hr>
          <div style="display:flex;justify-content: space-between;">
            <small style="display:flex;align-items:end;font-weight: bold;">${companyName}</small> 
            <small>Generated at ${format(new Date(), 'MM/dd/yyyy | h:mma')}</small>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open()
    printWindow!.document.write(tableHTML)
    printWindow!.document.close()
    printWindow!.print()

}

export function convertMBtoBytes(mb: number){
  return mb * 1024 * 1024
}