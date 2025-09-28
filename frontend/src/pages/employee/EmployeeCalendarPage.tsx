import Calendar from "../../components/ui/calendar/Calendar.tsx";
import {useTranslation} from "react-i18next";

function EmployeeCalendarPage() {
  const {t} = useTranslation();
  const tc = (key: string) => t(`pages.employee.calendar.${key}`);

  return (
    <Calendar title={tc("title")}
              subtitle={tc("subtitle")}
              fetchingUrl="/schedule?date="
    />
  );
}

export default EmployeeCalendarPage;
