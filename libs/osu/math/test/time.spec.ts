import { formatGameTime } from "../src/time";

const dateHMS = (h: number, m: number, s: number, ms: number) => h * 1000 * 60 * 60 + m * 60 * 1000 + s * 1000 + ms;

test("formatGameTime", () => {
  expect(formatGameTime(dateHMS(2, 4, 5, 0))).toBe("2:04:05");
  expect(formatGameTime(dateHMS(0, 4, 5, 0))).toBe("4:05");
  expect(formatGameTime(dateHMS(0, 4, 0, 0))).toBe("4:00");
  expect(formatGameTime(dateHMS(0, 4, 0, 20), true)).toBe("4:00.020");
  expect(formatGameTime(dateHMS(0, 0, 0, 0), true)).toBe("0:00.000");
});
