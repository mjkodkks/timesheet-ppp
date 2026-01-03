import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { HolidayCalendarResponse } from "../types/shared";
import { monthsTHToNumber } from "./utility";

const app = new Elysia()
  .use(
    await staticPlugin({
      prefix: "/",
    })
  )
  .get("/hello", () => "Hello Elysia!")
  .get("/holidays", async () => {
    const accessToken = Bun.env.ACCESS_TOKEN_BOT;
    const apiUrl = Bun.env.API_URL;

    const url = new URL(`${apiUrl}/financial-institutions-holidays`);
    url.searchParams.append("year", "2024");
    console.log("Fetching holidays from URL:", url.toString());
    try {
      const rawResponse = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `${accessToken}`,
          Accept: "application/json, text/plain, */*",
        },
      });
      console.log("Raw response status:", rawResponse);
      const holidays = await rawResponse.json();
      console.log(holidays);
      return holidays;
    } catch (error) {
      console.error("Error fetching holidays:", error);
      return { error: "Failed to fetch holidays" };
    }
  })
  .get("/holidays-from-web", async ({ query }) => {
    try {
      let { year } = query;
      let yearQuery = (new Date().getFullYear() + 543).toString();
      if (!year) {
        year = yearQuery;
      }
      const url = Bun.env.API_URL_FROM_WEB + `/holidaycalendar_copy.model.${year}.json` || "";
      // console.log(url)
      const rawResponse = await fetch(url);
      const response = await rawResponse.json() as HolidayCalendarResponse;
      // console.log("Fetched holiday page:", response);
      const formattedHolidays = response.holidayCalendarLists.map((item) => {
        const formattedDay = item.date.split(" ")[1]; // ดึงเฉพาะตัวเลขวันที่
        const monthTH = item.month;
        const month = monthsTHToNumber(monthTH);
        const yearBuddhist = item.year;
        const year = (parseInt(yearBuddhist) - 543).toString(); // แปลงเป็น ค.ศ.
        const formattedDate = `${year}-${month}-${formattedDay.padStart(2, '0')}`;
        console.log("Formatted date:", formattedDate);
        
        return {
          date: formattedDate,
          description: item.holidayDescription,
        }
      })

      return formattedHolidays;
    } catch (error) {
      console.error("Error fetching holidays from web:", error);
      return { error: "Failed to fetch holidays from web" };
    }
  })

  .listen(4343);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
