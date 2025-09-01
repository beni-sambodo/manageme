import moment from "moment";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTodayOrFirstDate = (dates: any[]) => {
  const today = moment().format("DD.MM.YYYY");
  const formattedDates = dates.map((date: { date: moment.MomentInput }) =>
    moment(date.date).format("DD.MM.YYYY")
  );
  return formattedDates.includes(today)
    ? dates.find(
      (date: { date: moment.MomentInput }) =>
        moment(date.date).format("DD.MM.YYYY") === today
    )._id
    : dates[0]._id;
};

export const isLessonStarted = (date: string) => moment().isSameOrAfter(moment(date));
