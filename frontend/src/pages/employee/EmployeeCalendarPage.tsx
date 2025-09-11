import Calendar from "../../components/ui/Calendar.tsx";
import {useTranslation} from "react-i18next";

function EmployeeCalendarPage() {
  const {t} = useTranslation();
  const tc = (key: string) => t(`pages.employee.calendar.${key}`);

  return (
    <Calendar title={tc("title")} subtitle={tc("subtitle")}/>
  );
}

export default EmployeeCalendarPage;
