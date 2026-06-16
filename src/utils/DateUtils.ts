export class DateUtils {
  static stringToDate(_date, _format, _delimiter): Date {
    if (!_date) {
      return new Date();
    }
    const formatLowerCase = _format.toLowerCase();
    const formatItems = formatLowerCase.split(_delimiter);
    const dateItems = _date.split(_delimiter);
    const monthIndex = formatItems.indexOf("mm");
    const dayIndex = formatItems.indexOf("dd");
    const yearIndex = formatItems.indexOf("yyyy");
    const month = Number.parseInt(dateItems[monthIndex]) - 1;
    const formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
  }
}
