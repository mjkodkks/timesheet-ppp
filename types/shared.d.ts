export interface HolidayCalendarResponse {
  notFoundEventLabel: string;
  holidayCalendarLists: HolidayCalendarItem[];
  calendarDisclaimer: string; // HTML string from source
  ":type": string;
}

export interface HolidayCalendarItem {
  holidayDescription: string;
  date: string; // message date "วันพฤหัสบดี 1"
  month: string; // "มกราคม"
  year: string; // "2569"
}
